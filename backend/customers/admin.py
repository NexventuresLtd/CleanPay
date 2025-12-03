"""
Customer Management Admin
Admin interface configuration for Customer, PaymentMethod, and CustomerNote models.
"""

from django.contrib import admin
from .models import Customer, PaymentMethod, CustomerNote


class PaymentMethodInline(admin.TabularInline):
    """Inline admin for payment methods."""
    model = PaymentMethod
    extra = 0
    fields = ('type', 'card_brand', 'card_last4', 'is_default', 'is_verified', 'created_at')
    readonly_fields = ('created_at',)
    can_delete = True


class CustomerNoteInline(admin.TabularInline):
    """Inline admin for customer notes."""
    model = CustomerNote
    extra = 0
    fields = ('note', 'is_pinned', 'created_by', 'created_at')
    readonly_fields = ('created_by', 'created_at')
    can_delete = True


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    """Admin interface for Customer model."""
    
    list_display = (
        'get_full_name',
        'company_name',
        'email',
        'phone',
        'status',
        'payment_terms',
        'created_at'
    )
    list_filter = ('status', 'payment_terms', 'industry', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'company_name', 'phone')
    readonly_fields = ('id', 'created_at', 'updated_at', 'deleted_at', 'created_by')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'first_name', 'last_name', 'company_name', 'email', 'phone')
        }),
        ('Business Information', {
            'fields': ('tax_id', 'website', 'industry')
        }),
        ('Address Information', {
            'fields': ('billing_address', 'shipping_address'),
            'classes': ('collapse',)
        }),
        ('Payment Settings', {
            'fields': ('payment_terms', 'credit_limit', 'preferred_payment_method')
        }),
        ('Status & Metadata', {
            'fields': ('status', 'notes', 'tags', 'custom_fields')
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at', 'deleted_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [PaymentMethodInline, CustomerNoteInline]
    
    def get_full_name(self, obj):
        """Display customer's full name."""
        return obj.get_full_name()
    get_full_name.short_description = 'Full Name'
    get_full_name.admin_order_field = 'first_name'


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    """Admin interface for PaymentMethod model."""
    
    list_display = (
        '__str__',
        'customer',
        'type',
        'is_default',
        'is_verified',
        'created_at'
    )
    list_filter = ('type', 'is_default', 'is_verified', 'card_brand', 'created_at')
    search_fields = ('customer__first_name', 'customer__last_name', 'customer__email', 'card_last4', 'account_last4')
    readonly_fields = ('id', 'created_at', 'updated_at', 'deleted_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'customer', 'type')
        }),
        ('Card Information', {
            'fields': (
                'card_brand',
                'card_last4',
                'card_exp_month',
                'card_exp_year',
                'card_holder_name'
            ),
            'classes': ('collapse',)
        }),
        ('Bank Account Information', {
            'fields': (
                'bank_name',
                'account_last4',
                'routing_number_last4',
                'account_type',
                'account_holder_name'
            ),
            'classes': ('collapse',)
        }),
        ('Gateway Information', {
            'fields': ('gateway_token', 'gateway_customer_id'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('is_default', 'is_verified', 'billing_address', 'metadata')
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at', 'deleted_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CustomerNote)
class CustomerNoteAdmin(admin.ModelAdmin):
    """Admin interface for CustomerNote model."""
    
    list_display = (
        'get_note_preview',
        'customer',
        'created_by',
        'is_pinned',
        'created_at'
    )
    list_filter = ('is_pinned', 'created_at', 'created_by')
    search_fields = ('note', 'customer__first_name', 'customer__last_name', 'customer__email')
    readonly_fields = ('id', 'created_at', 'updated_at', 'created_by')
    
    fieldsets = (
        ('Note Information', {
            'fields': ('id', 'customer', 'note', 'is_pinned')
        }),
        ('System Information', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_note_preview(self, obj):
        """Display note preview."""
        preview = obj.note[:50] + '...' if len(obj.note) > 50 else obj.note
        return preview
    get_note_preview.short_description = 'Note'
