"""
Customer Management Models
Handles customer data, payment methods, and customer notes.
"""

import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import EmailValidator, RegexValidator
from django.utils import timezone

User = get_user_model()


class Customer(models.Model):
    """
    Customer model - represents a customer in the system.
    Can be linked to a User account or exist as a standalone customer.
    """
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('archived', 'Archived'),
    ]
    
    PAYMENT_TERMS_CHOICES = [
        ('immediate', 'Immediate'),
        ('net_15', 'Net 15'),
        ('net_30', 'Net 30'),
        ('net_60', 'Net 60'),
        ('net_90', 'Net 90'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # User relationship (optional - for customers with login accounts)
    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='customer_profile'
    )
    
    # Basic Information
    company_name = models.CharField(max_length=255, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(validators=[EmailValidator()])
    phone = models.CharField(
        max_length=20,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )],
        blank=True
    )
    
    # Business Information
    tax_id = models.CharField(max_length=50, blank=True, help_text="Tax ID / EIN")
    website = models.URLField(blank=True)
    industry = models.CharField(max_length=100, blank=True)
    
    # Address Information (stored as JSON for flexibility)
    billing_address = models.JSONField(
        default=dict,
        blank=True,
        help_text="JSON format: {street, city, state, postal_code, country}"
    )
    shipping_address = models.JSONField(
        default=dict,
        blank=True,
        help_text="JSON format: {street, city, state, postal_code, country}"
    )
    
    # Payment Settings
    payment_terms = models.CharField(
        max_length=20,
        choices=PAYMENT_TERMS_CHOICES,
        default='net_30'
    )
    credit_limit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Maximum credit allowed"
    )
    preferred_payment_method = models.CharField(
        max_length=50,
        blank=True,
        help_text="Preferred payment method type"
    )
    
    # Status and Metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notes = models.TextField(blank=True, help_text="Internal notes about the customer")
    tags = models.JSONField(default=list, blank=True, help_text="Customer tags for categorization")
    custom_fields = models.JSONField(default=dict, blank=True, help_text="Additional custom data")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # Relationship tracking
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='customers_created'
    )
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['status']),
            models.Index(fields=['company_name']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        if self.company_name:
            return f"{self.company_name} - {self.get_full_name()}"
        return self.get_full_name()
    
    def get_full_name(self):
        """Return the customer's full name."""
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_billing_address_string(self):
        """Format billing address as a string."""
        if not self.billing_address:
            return ""
        addr = self.billing_address
        parts = [
            addr.get('street', ''),
            addr.get('city', ''),
            f"{addr.get('state', '')} {addr.get('postal_code', '')}".strip(),
            addr.get('country', '')
        ]
        return ", ".join(filter(None, parts))
    
    def get_shipping_address_string(self):
        """Format shipping address as a string."""
        if not self.shipping_address:
            return ""
        addr = self.shipping_address
        parts = [
            addr.get('street', ''),
            addr.get('city', ''),
            f"{addr.get('state', '')} {addr.get('postal_code', '')}".strip(),
            addr.get('country', '')
        ]
        return ", ".join(filter(None, parts))
    
    def soft_delete(self):
        """Soft delete the customer."""
        self.deleted_at = timezone.now()
        self.status = 'archived'
        self.save()
    
    def is_active(self):
        """Check if customer is active."""
        return self.status == 'active' and self.deleted_at is None


class PaymentMethod(models.Model):
    """
    Payment Method model - stores tokenized payment method information.
    Actual card/bank details are stored with the payment processor (e.g., Stripe).
    """
    
    TYPE_CHOICES = [
        ('card', 'Credit/Debit Card'),
        ('bank_account', 'Bank Account'),
        ('cash', 'Cash'),
        ('check', 'Check'),
        ('other', 'Other'),
    ]
    
    CARD_BRAND_CHOICES = [
        ('visa', 'Visa'),
        ('mastercard', 'Mastercard'),
        ('amex', 'American Express'),
        ('discover', 'Discover'),
        ('diners', 'Diners Club'),
        ('jcb', 'JCB'),
        ('unionpay', 'UnionPay'),
        ('other', 'Other'),
    ]
    
    ACCOUNT_TYPE_CHOICES = [
        ('checking', 'Checking'),
        ('savings', 'Savings'),
        ('business_checking', 'Business Checking'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='payment_methods'
    )
    
    # Payment Method Type
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    # Card Information (for display only - no full numbers stored)
    card_brand = models.CharField(max_length=20, choices=CARD_BRAND_CHOICES, blank=True)
    card_last4 = models.CharField(max_length=4, blank=True, help_text="Last 4 digits of card")
    card_exp_month = models.IntegerField(null=True, blank=True)
    card_exp_year = models.IntegerField(null=True, blank=True)
    card_holder_name = models.CharField(max_length=255, blank=True)
    
    # Bank Account Information (for display only)
    bank_name = models.CharField(max_length=255, blank=True)
    account_last4 = models.CharField(max_length=4, blank=True, help_text="Last 4 digits of account")
    routing_number_last4 = models.CharField(max_length=4, blank=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, blank=True)
    account_holder_name = models.CharField(max_length=255, blank=True)
    
    # Payment Gateway Token (e.g., Stripe payment method ID)
    gateway_token = models.CharField(
        max_length=255,
        blank=True,
        help_text="Payment gateway token/ID (e.g., Stripe pm_xxx)"
    )
    gateway_customer_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Customer ID in payment gateway"
    )
    
    # Settings
    is_default = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Metadata
    billing_address = models.JSONField(default=dict, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-is_default', '-created_at']
        indexes = [
            models.Index(fields=['customer', 'is_default']),
            models.Index(fields=['type']),
        ]
    
    def __str__(self):
        if self.type == 'card':
            return f"{self.card_brand} ****{self.card_last4}"
        elif self.type == 'bank_account':
            return f"{self.bank_name} ****{self.account_last4}"
        return f"{self.get_type_display()}"
    
    def save(self, *args, **kwargs):
        """Override save to ensure only one default payment method per customer."""
        if self.is_default:
            # Set all other payment methods for this customer to non-default
            PaymentMethod.objects.filter(
                customer=self.customer,
                is_default=True
            ).exclude(id=self.id).update(is_default=False)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        """Check if card is expired (for card type only)."""
        if self.type != 'card' or not self.card_exp_month or not self.card_exp_year:
            return False
        
        now = timezone.now()
        expiry_date = timezone.datetime(
            year=self.card_exp_year,
            month=self.card_exp_month,
            day=1
        )
        return now > expiry_date


class CustomerNote(models.Model):
    """
    Customer Note model - internal notes about customers.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='customer_notes'
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='customer_notes_created'
    )
    
    note = models.TextField()
    is_pinned = models.BooleanField(default=False, help_text="Pin important notes to top")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_pinned', '-created_at']
        indexes = [
            models.Index(fields=['customer', '-created_at']),
        ]
    
    def __str__(self):
        preview = self.note[:50] + '...' if len(self.note) > 50 else self.note
        return f"Note by {self.created_by} on {self.created_at.date()}: {preview}"
