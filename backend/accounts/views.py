from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import secrets

from .models import User, Role, PasswordResetToken, AuditLog
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    RoleSerializer, LoginSerializer, ChangePasswordSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    AuditLogSerializer
)
from .permissions import IsAdmin, IsOwnerOrAdmin

User = get_user_model()


class RegisterView(viewsets.GenericViewSet):
    """API endpoint for user registration."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCreateSerializer
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new user."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # TODO: Send verification email
        
        return Response({
            'message': 'User registered successfully. Please check your email for verification.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """API endpoint for user login."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        """Login user and return tokens."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Update last login
        user.last_login = timezone.now()
        user.last_login_ip = self.get_client_ip(request)
        user.failed_login_attempts = 0
        user.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Log audit
        self.log_audit(request, user, 'login')
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    
    def get_client_ip(self, request):
        """Get client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def log_audit(self, request, user, action):
        """Log audit event."""
        AuditLog.objects.create(
            user=user,
            action=action,
            entity_type='auth',
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )


class LogoutView(viewsets.GenericViewSet):
    """API endpoint for user logout."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Logout user by blacklisting refresh token."""
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Log audit
            AuditLog.objects.create(
                user=request.user,
                action='logout',
                entity_type='auth',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({'message': 'Successfully logged out.'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        """Get client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint for user management."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['role', 'is_active', 'is_verified']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering_fields = ['created_at', 'email', 'first_name', 'last_name']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'destroy', 'update_role']:
            return [IsAdmin()]
        elif self.action in ['update', 'partial_update']:
            return [IsOwnerOrAdmin()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Get current user profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_profile(self, request):
        """Update current user profile."""
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Log audit
        AuditLog.objects.create(
            user=request.user,
            action='update_profile',
            entity_type='user',
            entity_id=request.user.id,
            new_values=serializer.data
        )
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        """Change user password."""
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Log audit
        AuditLog.objects.create(
            user=user,
            action='change_password',
            entity_type='user',
            entity_id=user.id
        )
        
        return Response({'message': 'Password changed successfully.'})
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdmin])
    def update_role(self, request, pk=None):
        """Update user role (admin only)."""
        user = self.get_object()
        role_id = request.data.get('role_id')
        
        if not role_id:
            return Response({'error': 'role_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            role = Role.objects.get(id=role_id)
            old_role = user.role
            user.role = role
            user.save()
            
            # Log audit
            AuditLog.objects.create(
                user=request.user,
                action='update_role',
                entity_type='user',
                entity_id=user.id,
                old_values={'role': str(old_role) if old_role else None},
                new_values={'role': str(role)}
            )
            
            return Response(UserSerializer(user).data)
        except Role.DoesNotExist:
            return Response({'error': 'Role not found'}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetViewSet(viewsets.GenericViewSet):
    """API endpoint for password reset."""
    
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def request_reset(self, request):
        """Request password reset."""
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            
            # Generate token
            token = secrets.token_urlsafe(32)
            expires_at = timezone.now() + timedelta(hours=24)
            
            PasswordResetToken.objects.create(
                user=user,
                token=token,
                expires_at=expires_at
            )
            
            # TODO: Send reset email with token
            
            return Response({'message': 'Password reset email sent.'})
        except User.DoesNotExist:
            # Don't reveal if user exists
            return Response({'message': 'Password reset email sent.'})
    
    @action(detail=False, methods=['post'])
    def confirm_reset(self, request):
        """Confirm password reset with token."""
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
            
            if not reset_token.is_valid():
                return Response({'error': 'Token is invalid or expired.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = reset_token.user
            user.set_password(new_password)
            user.save()
            
            reset_token.used = True
            reset_token.save()
            
            # Log audit
            AuditLog.objects.create(
                user=user,
                action='password_reset',
                entity_type='user',
                entity_id=user.id
            )
            
            return Response({'message': 'Password reset successfully.'})
        except PasswordResetToken.DoesNotExist:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class RoleViewSet(viewsets.ModelViewSet):
    """API endpoint for role management."""
    
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdmin]
    search_fields = ['name', 'display_name']


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for audit logs (read-only)."""
    
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['user', 'action', 'entity_type']
    search_fields = ['action', 'entity_type', 'user__email']
    ordering_fields = ['created_at']
