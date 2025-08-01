from rest_framework import serializers
from jobapp.models import Job, Applicant, BookmarkJob, Category  # Ensure you have a Category model
from account.models import User

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'timestamp', 'last_date']  # Include necessary fields

class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['title', 'job_type', 'category', 'description', 'last_date', 'company_name', 'company_description']

    def validate(self, data):
        # Ensure all required fields are present
        required_fields = ['title', 'job_type', 'category', 'description', 'last_date', 'company_name', 'company_description']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: f"{field.replace('_', ' ').capitalize()} is required."})
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']  # Include necessary user fields

class ApplicantSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Include user details
    job = JobSerializer()  # Nest the JobSerializer to include job details

    class Meta:
        model = Applicant
        fields = ['id', 'user', 'job', 'timestamp']  # Include user and job details

class BookmarkJobSerializer(serializers.ModelSerializer):
    job = JobSerializer()  # Nest the JobSerializer to include job details

    class Meta:
        model = BookmarkJob
        fields = ['id', 'job', 'timestamp']  # Include job and timestamp

class JobApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = ['job', 'resume', 'cover_letter']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']  # Adjust fields based on your Category model
