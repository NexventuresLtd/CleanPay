"""
Management command to seed operations data (service areas, routes, collectors, schedules)
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import time, timedelta
from accounts.company_models import Company
from accounts.models import User
from customers.models import Customer
from operations.models import ServiceArea, Route, Collector, Schedule
import random


class Command(BaseCommand):
    help = 'Seed operations data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Starting operations data seeding...')
        
        # Get the first company
        try:
            company = Company.objects.first()
            if not company:
                self.stdout.write(self.style.ERROR('No company found. Please create a company first.'))
                return
            
            self.stdout.write(f'Using company: {company.name}')
            
            # Create service areas
            service_areas = self.create_service_areas(company)
            
            # Create collectors
            collectors = self.create_collectors(company)
            
            # Create routes
            routes = self.create_routes(service_areas, collectors)
            
            # Assign customers to service areas and routes
            self.assign_customers_to_areas(service_areas, routes)
            
            # Create schedules
            self.create_schedules(routes, collectors)
            
            self.stdout.write(self.style.SUCCESS('✓ Operations data seeded successfully!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error seeding data: {str(e)}'))
            import traceback
            traceback.print_exc()

    def create_service_areas(self, company):
        self.stdout.write('Creating service areas...')
        
        areas_data = [
            {
                'name': 'Kimironko Cell A',
                'code': 'KIM-A',
                'description': 'Kimironko residential area - Section A',
                'province': 'Kigali City',
                'district': 'Gasabo',
                'sector': 'Remera',
                'cell': 'Kimironko',
                'village': 'Kimironko A',
                'estimated_households': 250,
                'estimated_customers': 180,
            },
            {
                'name': 'Kimironko Cell B',
                'code': 'KIM-B',
                'description': 'Kimironko residential area - Section B',
                'province': 'Kigali City',
                'district': 'Gasabo',
                'sector': 'Remera',
                'cell': 'Kimironko',
                'village': 'Kimironko B',
                'estimated_households': 300,
                'estimated_customers': 220,
            },
            {
                'name': 'Gisimenti Village',
                'code': 'GIS-01',
                'description': 'Gisimenti village waste collection area',
                'province': 'Kigali City',
                'district': 'Gasabo',
                'sector': 'Remera',
                'cell': 'Rukiri',
                'village': 'Gisimenti',
                'estimated_households': 180,
                'estimated_customers': 120,
            },
            {
                'name': 'Nyarutarama Estate',
                'code': 'NYA-01',
                'description': 'Nyarutarama residential estate',
                'province': 'Kigali City',
                'district': 'Gasabo',
                'sector': 'Remera',
                'cell': 'Nyarutarama',
                'village': 'Nyarutarama',
                'estimated_households': 150,
                'estimated_customers': 140,
            },
        ]
        
        service_areas = []
        for area_data in areas_data:
            area, created = ServiceArea.objects.get_or_create(
                code=area_data['code'],
                defaults={
                    'company': company,
                    **area_data
                }
            )
            service_areas.append(area)
            status = 'created' if created else 'exists'
            self.stdout.write(f'  • {area.name} ({status})')
        
        return service_areas

    def create_collectors(self, company):
        self.stdout.write('Creating collectors...')
        
        collectors_data = [
            {
                'employee_id': 'COL-001',
                'first_name': 'Jean',
                'last_name': 'Mugabo',
                'email': 'jean.mugabo@cleanpay.rw',
                'phone': '+250788123456',
                'national_id': '1199012345678901',
                'employment_type': 'full_time',
                'status': 'active',
            },
            {
                'employee_id': 'COL-002',
                'first_name': 'Marie',
                'last_name': 'Uwase',
                'email': 'marie.uwase@cleanpay.rw',
                'phone': '+250788234567',
                'national_id': '1199112345678902',
                'employment_type': 'full_time',
                'status': 'active',
            },
            {
                'employee_id': 'COL-003',
                'first_name': 'Eric',
                'last_name': 'Nkunda',
                'email': 'eric.nkunda@cleanpay.rw',
                'phone': '+250788345678',
                'national_id': '1199212345678903',
                'employment_type': 'part_time',
                'status': 'active',
            },
            {
                'employee_id': 'COL-004',
                'first_name': 'Grace',
                'last_name': 'Umutoni',
                'email': 'grace.umutoni@cleanpay.rw',
                'phone': '+250788456789',
                'national_id': '1199312345678904',
                'employment_type': 'full_time',
                'status': 'active',
            },
        ]
        
        collectors = []
        for collector_data in collectors_data:
            collector, created = Collector.objects.get_or_create(
                employee_id=collector_data['employee_id'],
                defaults={
                    'company': company,
                    **collector_data
                }
            )
            collectors.append(collector)
            status = 'created' if created else 'exists'
            self.stdout.write(f'  • {collector.first_name} {collector.last_name} ({status})')
        
        return collectors

    def create_routes(self, service_areas, collectors):
        self.stdout.write('Creating routes...')
        
        routes = []
        
        # Create routes for each service area
        for idx, area in enumerate(service_areas):
            # Create 2 routes per area
            for route_num in range(1, 3):
                route_data = {
                    'service_area': area,
                    'name': f'{area.name} - Route {route_num}',
                    'code': f'{area.code}-R{route_num}',
                    'description': f'Collection route {route_num} for {area.name}',
                    'sequence_number': route_num,
                    'estimated_distance_km': random.uniform(2.5, 8.0),
                    'estimated_duration_minutes': random.randint(60, 180),
                    'frequency': random.choice(['twice_weekly', 'weekly']),
                    'collection_days': random.choice([
                        ['Monday', 'Thursday'],
                        ['Tuesday', 'Friday'],
                        ['Wednesday', 'Saturday'],
                        ['Monday'],
                        ['Wednesday'],
                    ]),
                    'collection_time_start': time(8, 0),
                    'collection_time_end': time(12, 0),
                    'default_collector': collectors[idx % len(collectors)],
                    'status': 'active',
                }
                
                route, created = Route.objects.get_or_create(
                    code=route_data['code'],
                    defaults=route_data
                )
                routes.append(route)
                status = 'created' if created else 'exists'
                self.stdout.write(f'  • {route.name} ({status})')
        
        return routes

    def assign_customers_to_areas(self, service_areas, routes):
        self.stdout.write('Assigning customers to service areas...')
        
        customers = Customer.objects.all()
        
        if not customers:
            self.stdout.write('  No customers found to assign')
            return
        
        for customer in customers:
            # Assign to random service area and route
            area = random.choice(service_areas)
            route = random.choice([r for r in routes if r.service_area == area])
            
            customer.service_area = area
            customer.route = route if hasattr(customer, 'route') else None
            customer.save()
        
        self.stdout.write(f'  • Assigned {customers.count()} customers to service areas')

    def create_schedules(self, routes, collectors):
        self.stdout.write('Creating collection schedules...')
        
        today = timezone.now().date()
        schedules = []
        
        for route in routes:
            # Create schedules for the next 2 weeks
            for week in range(2):
                for day_name in route.collection_days:
                    # Find the next occurrence of this day
                    days_ahead = self.get_days_ahead(today, day_name)
                    schedule_date = today + timedelta(days=days_ahead + (week * 7))
                    
                    schedule_data = {
                        'route': route,
                        'scheduled_date': schedule_date,
                        'scheduled_time_start': route.collection_time_start or time(8, 0),
                        'scheduled_time_end': route.collection_time_end or time(12, 0),
                        'collector': route.default_collector,
                        'status': 'scheduled',
                        'notes': f'Regular collection for {route.name}',
                    }
                    
                    schedule, created = Schedule.objects.get_or_create(
                        route=route,
                        scheduled_date=schedule_date,
                        defaults=schedule_data
                    )
                    schedules.append(schedule)
                    if created:
                        self.stdout.write(f'  • {schedule.route.name} on {schedule_date} ({schedule.status})')
        
        self.stdout.write(f'  Total schedules: {len(schedules)}')
        return schedules

    def get_days_ahead(self, from_date, day_name):
        """Get number of days until next occurrence of day_name"""
        days = {
            'Monday': 0,
            'Tuesday': 1,
            'Wednesday': 2,
            'Thursday': 3,
            'Friday': 4,
            'Saturday': 5,
            'Sunday': 6,
        }
        
        target_day = days[day_name]
        current_day = from_date.weekday()
        
        if target_day >= current_day:
            return target_day - current_day
        else:
            return 7 - (current_day - target_day)
