import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import User
from accounts.company_models import Company
from customers.models import Customer
from operations.models import Collector, ServiceArea

print('\n=== DATABASE SUMMARY ===')
print(f'Users: {User.objects.count()}')
print(f'Companies: {Company.objects.count()}')
print(f'Customers: {Customer.objects.count()}')
print(f'Collectors: {Collector.objects.count()}')
print(f'Service Areas: {ServiceArea.objects.count()}')

print('\n=== CUSTOMER CARDS ===')
for customer in Customer.objects.all():
    print(f'{customer.get_full_name()}: {customer.card_number} (Balance: {customer.prepaid_balance})')

print('\n=== SYSTEM USERS ===')
for user in User.objects.all():
    print(f'{user.email} - {user.role.name if user.role else "No Role"} - Company: {user.company.name if user.company else "System Admin"}')
