from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from account.views import (
    EmployeeRegistrationAPI,
    EmployerRegistrationAPI,
    EmployeeProfileUpdateAPI,
    LogoutAPI,
    UserDetailAPI,  # Import the new view
)

urlpatterns = [
    path('register/employee/', EmployeeRegistrationAPI.as_view(), name='employee-register'),
    path('register/employer/', EmployerRegistrationAPI.as_view(), name='employer-register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT Refresh
    path('logout/', LogoutAPI.as_view(), name='logout'),
    path('profile/update/<int:pk>/', EmployeeProfileUpdateAPI.as_view(), name='employee-profile-update'),
    path('user/', UserDetailAPI.as_view(), name='user-detail'),  # Add the new endpoint
]
