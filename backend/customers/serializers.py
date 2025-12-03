"""
Customer Management Serializers
Handles serialization for Customer, PaymentMethod, and CustomerNote models.
"""

from rest_framework import serializers
from .models import Customer, PaymentMethod, CustomerNote
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomerNoteSerializer(serializers.ModelSerializer):
    """Serializer for CustomerNote model."""
    
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomerNote
        fields = [
            'id',
            'customer',
            'created_by',
            'created_by_name',
            'note',
            'is_pinned',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        """Get the full name of the user who created the note."""
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.email
        return "Unknown"


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for PaymentMethod model."""
    
    display_name = serializers.SerializerMethodField()
    is_expired_flag = serializers.SerializerMethodField()
    
    class Meta:
        model = PaymentMethod
        fields = [
            'id',
            'customer',
            'type',
            'card_brand',
            'card_last4',
            'card_exp_month',
            'card_exp_year',
            'card_holder_name',
            'bank_name',
            'account_last4',
            'routing_number_last4',
            'account_type',
            'account_holder_name',
            'gateway_token',
            'gateway_customer_id',
            'is_default',
            'is_verified',
            'billing_address',
            'metadata',
            'display_name',
            'is_expired_flag',
            'created_at',
            'updated_at',
            'deleted_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'gateway_token': {'write_only': True},
            'gateway_customer_id': {'write_only': True}
        }
    
    def get_display_name(self, obj):
        """Get a user-friendly display name for the payment method."""
        return str(obj)
    
    def get_is_expired_flag(self, obj):
        """Check if the payment method is expired."""
        return obj.is_expired()
    
    def validate(self, data):
        """Validate payment method data based on type."""
        payment_type = data.get('type')
        
        if payment_type == 'card':
            # Validate card-specific fields
            if not data.get('card_last4'):
                raise serializers.ValidationError("Card last 4 digits are required for card type.")
            if not data.get('card_exp_month') or not data.get('card_exp_year'):
                raise serializers.ValidationError("Card expiration date is required for card type.")
                
        elif payment_type == 'bank_account':
            # Validate bank account-specific fields
            if not data.get('account_last4'):
                raise serializers.ValidationError("Account last 4 digits are required for bank account type.")
        
        return data


class CustomerListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for customer list views."""
    
    full_name = serializers.SerializerMethodField()
    payment_methods_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = [
            'id',
            'company_name',
            'first_name',
            'last_name',
            'full_name',
            'email',
            'phone',
            'status',
            'payment_terms',
            'payment_methods_count',
            'created_at',
            'updated_at'
        ]
    
    def get_full_name(self, obj):
        """Get customer's full name."""
        return obj.get_full_name()
    
    def get_payment_methods_count(self, obj):
        """Get count of active payment methods."""
        return obj.payment_methods.filter(deleted_at__isnull=True).count()


class CustomerDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for customer detail views with nested relationships."""
    
    full_name = serializers.SerializerMethodField()
    billing_address_string = serializers.SerializerMethodField()
    shipping_address_string = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    payment_methods = PaymentMethodSerializer(many=True, read_only=True)
    customer_notes = CustomerNoteSerializer(many=True, read_only=True)
    is_active_flag = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = [
            'id',
            'user',
            'company_name',
            'first_name',
            'last_name',
            'full_name',
            'email',
            'phone',
            'tax_id',
            'website',
            'industry',
            'billing_address',
            'billing_address_string',
            'shipping_address',
            'shipping_address_string',
            'payment_terms',
            'credit_limit',
            'preferred_payment_method',
            'status',
            'notes',
            'tags',
            'custom_fields',
            'created_at',
            'updated_at',
            'deleted_at',
            'created_by',
            'created_by_name',
            'payment_methods',
            'customer_notes',
            'is_active_flag'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        """Get customer's full name."""
        return obj.get_full_name()
    
    def get_billing_address_string(self, obj):
        """Get formatted billing address."""
        return obj.get_billing_address_string()
    
    def get_shipping_address_string(self, obj):
        """Get formatted shipping address."""
        return obj.get_shipping_address_string()
    
    def get_created_by_name(self, obj):
        """Get the name of the user who created the customer."""
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.email
        return "Unknown"
    
    def get_is_active_flag(self, obj):
        """Check if customer is active."""
        return obj.is_active()


class CustomerCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating customers."""
    
    class Meta:
        model = Customer
        fields = [
            'id',
            'user',
            'company_name',
            'first_name',
            'last_name',
            'email',
            'phone',
            'tax_id',
            'website',
            'industry',
            'billing_address',
            'shipping_address',
            'payment_terms',
            'credit_limit',
            'preferred_payment_method',
            'status',
            'notes',
            'tags',
            'custom_fields'
        ]
        read_only_fields = ['id']
    
    def validate_email(self, value):
        """Validate that email is unique (excluding current instance)."""
        qs = Customer.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("A customer with this email already exists.")
        return value
    
    def validate_billing_address(self, value):
        """Validate billing address format."""
        if value:
            required_fields = ['street', 'city', 'state', 'postal_code', 'country']
            missing_fields = [field for field in required_fields if not value.get(field)]
            if missing_fields:
                raise serializers.ValidationError(
                    f"Billing address is missing required fields: {', '.join(missing_fields)}"
                )
        return value
    
    def validate_credit_limit(self, value):
        """Validate credit limit is non-negative."""
        if value < 0:
            raise serializers.ValidationError("Credit limit cannot be negative.")
        return value
    
    def create(self, validated_data):
        """Create a new customer and set created_by."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)


class CustomerStatsSerializer(serializers.Serializer):
    """Serializer for customer statistics."""
    
    total_customers = serializers.IntegerField()
    active_customers = serializers.IntegerField()
    suspended_customers = serializers.IntegerField()
    archived_customers = serializers.IntegerField()
    customers_with_payment_methods = serializers.IntegerField()
    total_credit_limit = serializers.DecimalField(max_digits=15, decimal_places=2)
    new_customers_this_month = serializers.IntegerField()
    new_customers_this_week = serializers.IntegerField()
