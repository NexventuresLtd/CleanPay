from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView, UserViewSet,
    PasswordResetViewSet, RoleViewSet, AuditLogViewSet
)
from .system_admin_views import SystemAdminCompanyViewSet

router = DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('roles', RoleViewSet, basename='role')
router.register('audit-logs', AuditLogViewSet, basename='audit-log')
router.register('auth', RegisterView, basename='register')
router.register('auth/logout', LogoutView, basename='logout')
router.register('auth/password-reset', PasswordResetViewSet, basename='password-reset')

# System Admin routes
router.register('system-admin/companies', SystemAdminCompanyViewSet, basename='system-admin-company')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
