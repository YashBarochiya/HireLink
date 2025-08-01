from rest_framework import serializers
from account.models import User  # Import the custom user model

class EmployeeRegistrationSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)
    gender = serializers.CharField(write_only=True, required=False)  # Optional if not required in the model

    class Meta:
        model = User  # Use the custom user model
        fields = ['firstName', 'lastName', 'email', 'password', 'gender', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        # Ensure role is always 'employee' for this serializer
        if data.get('role') and data['role'] != 'employee':
            raise serializers.ValidationError({"role": "Invalid role for employee registration."})
        return data

    def create(self, validated_data):
        # Remove username and use email as the unique identifier
        validated_data['role'] = 'employee'  # Ensure role is set
        validated_data['first_name'] = validated_data.pop('firstName')  # Map to first_name
        validated_data['last_name'] = validated_data.pop('lastName')  # Map to last_name
        return User.objects.create_user(**validated_data)


class EmployerRegistrationSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)  # Map company name
    last_name = serializers.CharField(write_only=True)  # Map company address

    class Meta:
        model = User  # Use the custom user model
        fields = ['first_name', 'last_name', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['role'] = 'employer'  # Ensure role is set
        return User.objects.create_user(**validated_data)


class EmployeeProfileEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Use the custom user model
        fields = ['email']


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)  # Changed from username to email
    password = serializers.CharField(write_only=True, required=True)
