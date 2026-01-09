"""
Seed script for IsukuPay database
Creates initial data: roles, users, company, customers, collectors, service areas
"""

import os
import django
import random

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import User, Role
from accounts.company_models import Company
from customers.models import Customer
from operations.models import Collector, ServiceArea

def seed_data():
    print("🌱 Starting data seeding...")
    
    # Create roles
    print("\n📋 Creating roles...")
    system_admin_role, _ = Role.objects.get_or_create(
        name='system_admin',
        defaults={
            'display_name': 'System Administrator',
            'description': 'Full system access'
        }
    )
    admin_role, _ = Role.objects.get_or_create(
        name='admin',
        defaults={
            'display_name': 'Company Administrator',
            'description': 'Company management'
        }
    )
    collector_role, _ = Role.objects.get_or_create(
        name='collector',
        defaults={
            'display_name': 'Collector',
            'description': 'Waste collector'
        }
    )
    customer_role, _ = Role.objects.get_or_create(
        name='customer',
        defaults={
            'display_name': 'Customer',
            'description': 'Service customer'
        }
    )
    print("✅ Roles created")
    
    # Create system admin user
    print("\n👤 Creating system admin...")
    admin, created = User.objects.get_or_create(
        email='admin@isukupay.rw',
        defaults={
            'password': 'pbkdf2_sha256$600000$' + 'x' * 50,  # Will be set properly below
            'first_name': 'System',
            'last_name': 'Admin',
            'role': system_admin_role,
            'is_superuser': True,
            'is_staff': True,
            'is_active': True,
            'is_verified': True
        }
    )
    if created:
        admin.set_password('admin123')
        admin.save()
        print(f"✅ System admin created: {admin.email}")
    else:
        print(f"ℹ️  System admin already exists: {admin.email}")
    
    # Create sample company
    print("\n🏢 Creating company...")
    company, created = Company.objects.get_or_create(
        name='C&GS Ltd',
        defaults={
            'email': 'contact@cgs.rw',
            'phone': '+250788123456',
            'address': {
                'district': 'Kigali',
                'sector': 'Kicukiro',
                'cell': 'Gahanga',
                'village': 'Karembure',
                'street': 'KG 123 St'
            },
            'service_districts': ['Kigali', 'Rwamagana', 'Kayonza'],
            'status': 'active',
            'is_verified': True,
            'max_customers': 1000,
            'max_collectors': 50,
            'prepaid_collection_price': 1000.00,
            'created_by': admin
        }
    )
    if created:
        print(f"✅ Company created: {company.name}")
    else:
        print(f"ℹ️  Company already exists: {company.name}")
    
    # Create company admin
    print("\n👤 Creating company admin...")
    company_admin, created = User.objects.get_or_create(
        email='admin@cgs.rw',
        defaults={
            'password': 'pbkdf2_sha256$600000$' + 'x' * 50,
            'first_name': 'John',
            'last_name': 'Mugisha',
            'role': admin_role,
            'company': company
        }
    )
    if created:
        company_admin.set_password('admin123')
        company_admin.save()
        print(f"✅ Company admin created: {company_admin.email}")
    else:
        print(f"ℹ️  Company admin already exists: {company_admin.email}")
    
    # Create customers
    print("\n👥 Creating customers...")
    existing_count = Customer.objects.filter(company=company).count()
    if existing_count > 0:
        print(f"ℹ️  {existing_count} customers already exist, skipping customer creation")
    else:
        districts = [
            {'district': 'Kicukiro', 'sector': 'Gahanga', 'cell': 'Karembure', 'village': 'Kanyinya'},
            {'district': 'Kicukiro', 'sector': 'Niboye', 'cell': 'Nyanza', 'village': 'Gikondo'},
            {'district': 'Gasabo', 'sector': 'Remera', 'cell': 'Rukiri', 'village': 'Amahoro'}
        ]
        
        names = [
            ('Jean', 'Uwimana'),
            ('Marie', 'Mukamana'),
            ('Pierre', 'Habimana'),
            ('Grace', 'Mutesi'),
            ('Emmanuel', 'Niyonzima'),
            ('Claudine', 'Umurerwa'),
            ('David', 'Nkurunziza'),
            ('Diane', 'Uwase'),
            ('Eric', 'Kayinamura'),
            ('Francine', 'Murekatete')
        ]
        
        for i, (first, last) in enumerate(names):
            location = random.choice(districts)
            
            # Create User account for customer
            customer_user = User.objects.create_user(
                email=f'{first.lower()}.{last.lower()}@customer.rw',
                password='customer123',
                first_name=first,
                last_name=last,
                role=customer_role,
                company=company
            )
            
            customer = Customer.objects.create(
                first_name=first,
                last_name=last,
                email=f'{first.lower()}.{last.lower()}@customer.rw',
                phone=f'+25078812{3457 + i}',
                billing_address=location,
                status='active',
                prepaid_balance=random.randint(5, 20),
                service_provider='C&GS Ltd',
                company=company,
                user=customer_user
            )
            print(f"  ✓ {customer.get_full_name()} - Card: {customer.card_number} | Email: {customer.email}")
    
    # Create service areas
    print("\n📍 Creating service areas...")
    existing_areas = ServiceArea.objects.filter(company=company).count()
    if existing_areas > 0:
        print(f"ℹ️  {existing_areas} service areas already exist, skipping")
    else:
        areas = [
            {
                'name': 'Kicukiro Zone A',
                'code': 'KCKA',
                'district': 'Kicukiro',
                'sector': 'Gahanga'
            },
            {
                'name': 'Kicukiro Zone B',
                'code': 'KCKB',
                'district': 'Kicukiro',
                'sector': 'Niboye'
            },
            {
                'name': 'Gasabo Zone A',
                'code': 'GSBA',
                'district': 'Gasabo',
                'sector': 'Remera'
            }
        ]
        
        for area_data in areas:
            area = ServiceArea.objects.create(
                name=area_data['name'],
                code=area_data['code'],
                district=area_data['district'],
                sector=area_data['sector'],
                status='active',
                company=company
            )
            print(f"  ✓ {area.name}")
    
    # Create collectors
    print("\n🚚 Creating collectors...")
    existing_collectors = Collector.objects.filter(company=company).count()
    if existing_collectors > 0:
        print(f"ℹ️  {existing_collectors} collectors already exist, skipping")
    else:
        collector_names = [
            ('Paul', 'Bizimana'),
            ('Joseph', 'Hakizimana'),
            ('Patrick', 'Nsengimana')
        ]
        
        for first, last in collector_names:
            # Create User account for collector
            collector_user = User.objects.create_user(
                email=f'{first.lower()}.{last.lower()}@cgs.rw',
                password='collector123',
                first_name=first,
                last_name=last,
                role=collector_role,
                company=company
            )
            
            collector = Collector.objects.create(
                employee_id=f'COL{random.randint(100, 999)}',
                first_name=first,
                last_name=last,
                email=f'{first.lower()}.{last.lower()}@cgs.rw',
                phone=f'+25078811{random.randint(1000, 9999)}',
                employment_type='full_time',
                status='active',
                company=company,
                user=collector_user
            )
            print(f"  ✓ {collector.full_name} ({collector.employee_id}) | Email: {collector.email}")
    
    print("\n✅ Data seeding completed successfully!")
    print("\n📝 Login credentials:")
    print("   System Admin: admin@isukupay.rw / admin123")
    print("   Company Admin: admin@cgs.rw / admin123")
    print("   \nCollector logins (password: collector123):")
    for col in Collector.objects.filter(company=company):
        print(f"     - {col.email}")
    print("   \nCustomer logins (password: customer123 OR use card number):")
    for cust in Customer.objects.filter(company=company)[:3]:
        print(f"     - Email: {cust.email} | Card: {cust.card_number}")
    print("     ... and 7 more customers")

if __name__ == '__main__':
    seed_data()
