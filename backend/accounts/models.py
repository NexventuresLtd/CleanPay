import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)


class Role(models.Model):
    """Role model for role-based access control."""
    
    ADMIN = 'admin'
    FINANCE_MANAGER = 'finance_manager'
    ACCOUNTANT = 'accountant'
    CUSTOMER_SERVICE = 'customer_service'
    CUSTOMER = 'customer'
    COLLECTOR = 'collector'
    
    ROLE_CHOICES = [
        (ADMIN, 'Administrator'),
        (FINANCE_MANAGER, 'Finance Manager'),
        (COLLECTOR, 'Collector'),
        (CUSTOMER_SERVICE, 'Customer Service'),
        (CUSTOMER, 'Customer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'roles'
        ordering = ['name']
    
    def __str__(self):
        return self.display_name


class User(AbstractUser):
    """Custom user model with UUID primary key and email authentication."""
    
    username = None  # Remove username field
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='users', null=True, blank=True)
    
    # Profile fields
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    company = models.CharField(max_length=255, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    
    # Status fields
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # MFA fields
    mfa_enabled = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=255, blank=True, null=True)
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    # Tracking fields
    last_login_ip = models.GenericIPAddressField(blank=True, null=True)
    failed_login_attempts = models.IntegerField(default=0)
    account_locked_until = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        return f"{self.first_name} {self.last_name}".strip()
    
    def has_role(self, role_name):
        """Check if user has a specific role."""
        return self.role and self.role.name == role_name
    
    def has_permission(self, permission_key):
        """Check if user has a specific permission."""
        if self.is_superuser:
            return True
        if self.role and self.role.permissions:
            return self.role.permissions.get(permission_key, False)
        return False


class PasswordResetToken(models.Model):
    """Model for password reset tokens."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'password_reset_tokens'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Password reset token for {self.user.email}"
    
    def is_valid(self):
        """Check if token is still valid."""
        from django.utils import timezone
        return not self.used and self.expires_at > timezone.now()


class AuditLog(models.Model):
    """Model for audit logging."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50)
    entity_id = models.UUIDField(null=True, blank=True)
    old_values = models.JSONField(null=True, blank=True)
    new_values = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['action']),
        ]
    
    def __str__(self):
        return f"{self.action} by {self.user} on {self.created_at}"
