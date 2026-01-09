from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Role, PasswordResetToken, AuditLog
from .company_models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'status', 'is_verified', 'customer_count', 'collector_count', 'created_at')
    list_filter = ('status', 'is_verified', 'created_at')
    search_fields = ('name', 'email', 'registration_number')
    readonly_fields = ('id', 'created_at', 'updated_at', 'customer_count', 'collector_count')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'registration_number', 'tax_id', 'email', 'phone', 'website')
        }),
        ('Address', {
            'fields': ('address', 'service_districts')
        }),
        ('Status & Verification', {
            'fields': ('status', 'is_verified')
        }),
        ('License', {
            'fields': ('license_start_date', 'license_end_date', 'max_customers', 'max_collectors')
        }),
        ('Branding', {
            'fields': ('logo', 'primary_color', 'prepaid_collection_price')
        }),
        ('Metadata', {
            'fields': ('notes', 'created_by', 'created_at', 'updated_at', 'customer_count', 'collector_count')
        }),
    )


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_name', 'created_at')
    search_fields = ('name', 'display_name')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_active', 'is_verified', 'created_at')
    list_filter = ('is_active', 'is_verified', 'is_staff', 'is_superuser', 'role')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'updated_at', 'last_login')
    
    fieldsets = (
        (None, {'fields': ('id', 'email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone', 'avatar', 'company', 'job_title')}),
        (_('Address'), {'fields': ('address', 'city', 'country')}),
        (_('Permissions'), {'fields': ('role', 'is_active', 'is_verified', 'is_staff', 'is_superuser')}),
        (_('Preferences'), {'fields': ('timezone', 'language', 'email_notifications', 'sms_notifications')}),
        (_('Security'), {'fields': ('mfa_enabled', 'failed_login_attempts', 'account_locked_until')}),
        (_('Dates'), {'fields': ('last_login', 'created_at', 'updated_at', 'deleted_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'expires_at', 'used', 'created_at')
    list_filter = ('used', 'created_at')
    search_fields = ('user__email', 'token')
    readonly_fields = ('id', 'created_at')


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'user', 'entity_type', 'entity_id', 'created_at')
    list_filter = ('action', 'entity_type', 'created_at')
    search_fields = ('user__email', 'action', 'entity_type')
    readonly_fields = ('id', 'created_at')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
