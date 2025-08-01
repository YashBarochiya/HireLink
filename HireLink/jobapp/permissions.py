from django.core.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

class IsEmployer(BasePermission):
    """
    Custom permission to allow only employers to access certain views.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employer'


class IsEmployee(BasePermission):
    """
    Custom permission to allow only employees to access certain views.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employee'