from django.urls import path
from jobapp import views
from jobapp.views import CategoryListView, EmployerJobsView, SavedJobsView, AppliedJobsView, ApplyJobView, JobBookmarkView, JobEditView, DeleteJobView  # Import the new views

app_name = "jobapp"

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('jobs/', views.JobListView.as_view(), name='job-list'),  # Ensure this is defined
    path('job/create/', views.CreateJobView.as_view(), name='create-job'),
    path('job/<int:id>/', views.SingleJobView.as_view(), name='single-job'),
    path('apply-job/<int:id>/', ApplyJobView.as_view(), name='apply-job'),
    path('bookmark-job/<int:id>/', JobBookmarkView.as_view(), name='bookmark-job'),
    path('result/', views.SearchJobView.as_view(), name='search_result'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('dashboard/employer/job/<int:id>/applicants/', views.AllApplicantsView.as_view(), name='applicants'),
    path('dashboard/employer/job/<int:id>/edit/', views.JobEditView.as_view(), name='edit-job'),
    path('dashboard/employer/job/<int:id>/delete/', views.DeleteJobView.as_view(), name='delete-job'),
    path('dashboard/employer/applicant/<int:id>/', views.ApplicantDetailsView.as_view(), name='applicant-details'),
    path('dashboard/employer/job/<int:id>/close/', views.MarkCompleteJobView.as_view(), name='complete'),
    path('dashboard/employee/delete-bookmark/<int:id>/', views.DeleteBookmarkView.as_view(), name='delete-bookmark'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('employer/jobs/', EmployerJobsView.as_view(), name='employer-jobs'),  # Add this line
    path('employee/saved-jobs/', SavedJobsView.as_view(), name='saved-jobs'),
    path('employee/applied-jobs/', AppliedJobsView.as_view(), name='applied-jobs'),
    path('job/edit/<int:id>/', JobEditView.as_view(), name='edit-job'),  # Add this route
    path('job/delete/<int:id>/', DeleteJobView.as_view(), name='delete-job'),  # Ensure "id" matches the lookup_field
]
