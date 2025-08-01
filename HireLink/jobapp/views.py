from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.contrib import messages
from django.urls import reverse_lazy
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from jobapp.models import Job, Applicant, BookmarkJob, Category
from jobapp.serializers import JobSerializer, ApplicantSerializer, BookmarkJobSerializer, JobCreateSerializer, CategorySerializer
from jobapp.permissions import IsEmployer, IsEmployee


User = get_user_model()


class HomeView(APIView):
    def get(self, request):
        published_jobs = Job.objects.filter(is_published=True).order_by('-timestamp')
        jobs = published_jobs.filter(is_closed=False)

        total_candidates = User.objects.filter(role='employee').count()
        total_companies = User.objects.filter(role='employer').count()

        page_number = request.GET.get('page', 1)  # Default to page 1 if not provided
        paginator = Paginator(jobs, 3)
        page_obj = paginator.get_page(page_number)

        job_lists = list(page_obj.object_list.values())
        next_page = page_obj.next_page_number() if page_obj.has_next() else None
        prev_page = page_obj.previous_page_number() if page_obj.has_previous() else None

        return Response({
            'job_lists': job_lists,
            'current_page_no': page_obj.number,
            'next_page_number': next_page,
            'no_of_page': paginator.num_pages,
            'prev_page_number': prev_page,
            'total_candidates': total_candidates,
            'total_companies': total_companies,
            'total_jobs': jobs.count(),
            'total_completed_jobs': published_jobs.filter(is_closed=True).count()
        })


class JobListView(ListAPIView):
    queryset = Job.objects.filter(is_published=True, is_closed=False).order_by('-timestamp')
    serializer_class = JobSerializer


class CreateJobView(CreateAPIView):
    serializer_class = JobCreateSerializer
    permission_classes = [IsAuthenticated, IsEmployer]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Ensure the user is saved as the employer


class SingleJobView(RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get(self, request, id):
        job = cache.get(id) or get_object_or_404(Job, id=id)
        cache.set(id, job, 60 * 15)
        return Response(JobSerializer(job).data)


class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def post(self, request, id):
        try:
            # Fetch the job using the provided ID
            job = get_object_or_404(Job, id=id)

            # Check if the user has already applied for the job
            applicant = Applicant.objects.filter(user=request.user, job=job)
            if applicant.exists():
                return Response({"error": "You already applied for this job!"}, status=status.HTTP_400_BAD_REQUEST)

            # Create a new application
            Applicant.objects.create(user=request.user, job=job)
            return Response({"message": "Successfully applied for the job!"}, status=status.HTTP_201_CREATED)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the error for debugging
            import traceback
            traceback.print_exc()
            return Response({"error": "An unexpected error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JobBookmarkView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def post(self, request, id):
        try:
            job = get_object_or_404(Job, id=id)
            existing = BookmarkJob.objects.filter(user=request.user, job=job)

            if existing.exists():
                return Response({"error": "You already saved this job!"}, status=status.HTTP_400_BAD_REQUEST)

            BookmarkJob.objects.create(user=request.user, job=job)
            return Response({"message": "Job bookmarked successfully!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SearchJobView(ListAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        job_list = Job.objects.order_by('-timestamp')

        title_or_company = self.request.GET.get('job_title_or_company_name', '')
        location = self.request.GET.get('location', '')
        job_type = self.request.GET.get('job_type', '')

        if title_or_company:
            job_list = job_list.filter(Q(title__icontains=title_or_company) | Q(company_name__icontains=title_or_company))

        if location:
            job_list = job_list.filter(location__icontains=location)

        if job_type:
            job_list = job_list.filter(job_type__iexact=job_type)

        return job_list


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'employer':
            jobs = Job.objects.filter(user=request.user)
            jobs_with_applicants = []
            for job in jobs:
                applicants_count = Applicant.objects.filter(job=job).count()  # Count applicants for each job
                job_data = JobSerializer(job).data
                job_data['applicants_count'] = applicants_count  # Add applicants count to job data
                jobs_with_applicants.append(job_data)

            return Response({
                'jobs': jobs_with_applicants
            })

        elif request.user.role == 'employee':
            savedjobs = BookmarkJob.objects.filter(user=request.user)
            appliedjobs = Applicant.objects.filter(user=request.user)
            return Response({
                'savedjobs': BookmarkJobSerializer(savedjobs, many=True).data,
                'appliedjobs': ApplicantSerializer(appliedjobs, many=True).data
            })


class DeleteJobView(DestroyAPIView):
    queryset = Job.objects.all()
    permission_classes = [IsAuthenticated, IsEmployer]
    lookup_field = "id"  # Use "id" instead of the default "pk"

    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)  # Ensure only the employer can delete their own jobs


class MarkCompleteJobView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]

    def post(self, request, id):
        job = get_object_or_404(Job, id=id, user=request.user)
        job.is_closed = True
        job.save()
        return Response({"message": "Job marked as closed!"}, status=status.HTTP_200_OK)


class AllApplicantsView(ListAPIView):
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticated, IsEmployer]

    def get_queryset(self):
        job_id = self.kwargs['id']  # Get the job ID from the URL
        return Applicant.objects.filter(job_id=job_id).select_related('user')  # Fetch applicants for the job


class ApplicantDetailsView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = ApplicantSerializer
    lookup_field = 'id'


class DeleteBookmarkView(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def delete(self, request, id):
        bookmark = get_object_or_404(BookmarkJob, id=id, user=request.user)
        bookmark.delete()
        return Response({"message": "Bookmark deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)


class JobEditView(UpdateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobCreateSerializer
    permission_classes = [IsAuthenticated, IsEmployer]

    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)  # Ensure only the employer can edit their own jobs


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class EmployerJobsView(ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated, IsEmployer]  # Restrict to authenticated employers

    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)  # Return jobs posted by the logged-in employer


class SavedJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        saved_jobs = BookmarkJob.objects.filter(user=request.user).select_related('job')  # Include related job details
        serializer = BookmarkJobSerializer(saved_jobs, many=True)
        return Response(serializer.data)


class AppliedJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applied_jobs = Applicant.objects.filter(user=request.user).select_related('job')  # Include related job details
        serializer = ApplicantSerializer(applied_jobs, many=True)
        return Response(serializer.data)

