"""
Management command to generate dummy data for operations module.
Creates service areas, routes, collectors, and schedules for testing.
"""

import random
from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role
from operations.models import ServiceArea, Route, Collector, Schedule

User = get_user_model()


class Command(BaseCommand):
    help = 'Generate dummy data for operations (service areas, routes, collectors, schedules)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before generating new data',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing operations data...')
            Schedule.objects.all().delete()
            Route.objects.all().delete()
            Collector.objects.all().delete()
            ServiceArea.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Cleared all operations data'))

        # Get or create admin user
        admin_user = User.objects.filter(is_staff=True).first()
        if not admin_user:
            admin_user = User.objects.create_superuser(
                email='admin@cleanpay.rw',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_user.email}'))

        # Create Service Areas
        self.stdout.write('Creating service areas...')
        service_areas = self.create_service_areas(admin_user)

        # Create Collectors
        self.stdout.write('Creating collectors...')
        collectors = self.create_collectors(admin_user, service_areas)

        # Create Routes
        self.stdout.write('Creating routes...')
        routes = self.create_routes(admin_user, service_areas, collectors)

        # Generate Schedules
        self.stdout.write('Generating schedules for next 30 days...')
        self.generate_schedules(routes)

        self.stdout.write(self.style.SUCCESS('\n✓ Dummy data generation complete!'))
        self.stdout.write(f'  - Service Areas: {len(service_areas)}')
        self.stdout.write(f'  - Collectors: {len(collectors)}')
        self.stdout.write(f'  - Routes: {len(routes)}')
        self.stdout.write(f'  - Schedules: {Schedule.objects.count()}')

    def create_service_areas(self, admin_user):
        """Create service areas in Kigali"""
        areas_data = [
            {
                'code': 'SA-001',
                'name': 'Downtown Zone',
                'description': 'Central business district and commercial area',
                'province': 'Kigali City',
                'district': 'Nyarugenge',
                'sector': 'Nyarugenge',
                'cell': 'Biryogo',
                'latitude': -1.9536,
                'longitude': 30.0606,
                'estimated_households': 1500,
                'estimated_customers': 850,
                'status': 'active',
            },
            {
                'code': 'SA-002',
                'name': 'Kimironko Zone',
                'description': 'Residential and market area',
                'province': 'Kigali City',
                'district': 'Gasabo',
                'sector': 'Kimironko',
                'cell': 'Kibagabaga',
                'latitude': -1.9403,
                'longitude': 30.1078,
                'estimated_households': 2200,
                'estimated_customers': 1200,
                'status': 'active',
            },
            {
                'code': 'SA-003',
                'name': 'Kicukiro Zone',
                'description': 'Mixed residential and commercial zone',
                'province': 'Kigali City',
                'district': 'Kicukiro',
                'sector': 'Kicukiro',
                'cell': 'Kagarama',
                'latitude': -1.9774,
                'longitude': 30.0897,
                'estimated_households': 1800,
                'estimated_customers': 950,
                'status': 'active',
            },
            {
                'code': 'SA-004',
                'name': 'Remera Zone',
                'description': 'Commercial and residential hub',
                'province': 'Kigali City',
                'district': 'Gasabo',
                'sector': 'Remera',
                'cell': 'Rukiri I',
                'latitude': -1.9575,
                'longitude': 30.1048,
                'estimated_households': 1600,
                'estimated_customers': 900,
                'status': 'active',
            },
            {
                'code': 'SA-005',
                'name': 'Nyamirambo Zone',
                'description': 'Cultural and residential area',
                'province': 'Kigali City',
                'district': 'Nyarugenge',
                'sector': 'Nyamirambo',
                'cell': 'Mumena',
                'latitude': -1.9789,
                'longitude': 30.0453,
                'estimated_households': 2000,
                'estimated_customers': 1100,
                'status': 'active',
            },
        ]

        service_areas = []
        for data in areas_data:
            area, created = ServiceArea.objects.update_or_create(
                code=data['code'],
                defaults={**data, 'created_by': admin_user}
            )
            service_areas.append(area)
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status}: {area.name}')

        return service_areas

    def create_collectors(self, admin_user, service_areas):
        """Create collectors with user accounts"""
        collectors_data = [
            {
                'employee_id': 'COL-001',
                'first_name': 'Jean',
                'last_name': 'Mugabo',
                'email': 'jean.mugabo@cleanpay.rw',
                'phone': '+250788100001',
                'national_id': '1199080012345678',
                'employment_type': 'full_time',
                'address': 'Kimironko, Kigali',
            },
            {
                'employee_id': 'COL-002',
                'first_name': 'Marie',
                'last_name': 'Uwimana',
                'email': 'marie.uwimana@cleanpay.rw',
                'phone': '+250788100002',
                'national_id': '1199285012345678',
                'employment_type': 'full_time',
                'address': 'Remera, Kigali',
            },
            {
                'employee_id': 'COL-003',
                'first_name': 'Emmanuel',
                'last_name': 'Habimana',
                'email': 'emmanuel.habimana@cleanpay.rw',
                'phone': '+250788100003',
                'national_id': '1198580012345678',
                'employment_type': 'full_time',
                'address': 'Nyamirambo, Kigali',
            },
            {
                'employee_id': 'COL-004',
                'first_name': 'Claudine',
                'last_name': 'Mukamana',
                'email': 'claudine.mukamana@cleanpay.rw',
                'phone': '+250788100004',
                'national_id': '1199590012345678',
                'employment_type': 'full_time',
                'address': 'Kicukiro, Kigali',
            },
            {
                'employee_id': 'COL-005',
                'first_name': 'Patrick',
                'last_name': 'Nshimiyimana',
                'email': 'patrick.nshimiyimana@cleanpay.rw',
                'phone': '+250788100005',
                'national_id': '1199280012345678',
                'employment_type': 'part_time',
                'address': 'Downtown, Kigali',
            },
            {
                'employee_id': 'COL-006',
                'first_name': 'Alice',
                'last_name': 'Ingabire',
                'email': 'alice.ingabire@cleanpay.rw',
                'phone': '+250788100006',
                'national_id': '1199780012345678',
                'employment_type': 'full_time',
                'address': 'Gasabo, Kigali',
            },
        ]

        collectors = []
        
        # Get or create collector role
        collector_role, _ = Role.objects.get_or_create(
            name='collector',
            defaults={'description': 'Waste collector with route assignments'}
        )
        
        for data in collectors_data:
            # Create or get user account for collector
            user, user_created = User.objects.get_or_create(
                email=data['email'],
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'phone': data['phone'],
                    'role': collector_role,
                    'is_active': True,
                }
            )
            if user_created:
                user.set_password('collector123')
                user.save()

            # Create collector profile
            collector, created = Collector.objects.update_or_create(
                employee_id=data['employee_id'],
                defaults={
                    **data,
                    'user': user,
                    'hire_date': date.today() - timedelta(days=random.randint(30, 365)),
                    'status': 'active',
                    'rating': round(random.uniform(4.0, 5.0), 2),
                    'total_collections': random.randint(100, 500),
                    'device_id': f'DEV-{data["employee_id"]}',
                    'nfc_reader_id': f'NFC-{data["employee_id"]}',
                    'created_by': admin_user,
                }
            )

            # Assign to random service areas (1-3)
            assigned_areas = random.sample(service_areas, min(len(service_areas), random.randint(1, 3)))
            collector.service_areas.set(assigned_areas)

            collectors.append(collector)
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status}: {collector.full_name} ({collector.employee_id})')

        return collectors

    def create_routes(self, admin_user, service_areas, collectors):
        """Create routes for each service area"""
        routes_data = [
            # Downtown Zone routes
            {
                'service_area_code': 'SA-001',
                'code': 'RT-001',
                'name': 'Route A - Monday/Thursday',
                'description': 'Central business district main route',
                'sequence_number': 1,
                'estimated_distance_km': 8.5,
                'estimated_duration_minutes': 180,
                'frequency': 'twice_weekly',
                'collection_days': ['monday', 'thursday'],
                'collection_time_start': time(6, 0),
                'collection_time_end': time(12, 0),
                'path_geojson': {
                    'type': 'LineString',
                    'coordinates': [
                        [30.0606, -1.9536],
                        [30.0620, -1.9550],
                        [30.0640, -1.9560],
                        [30.0660, -1.9545],
                    ]
                },
            },
            {
                'service_area_code': 'SA-001',
                'code': 'RT-002',
                'name': 'Route B - Tuesday/Friday',
                'description': 'Downtown residential area',
                'sequence_number': 2,
                'estimated_distance_km': 6.2,
                'estimated_duration_minutes': 150,
                'frequency': 'twice_weekly',
                'collection_days': ['tuesday', 'friday'],
                'collection_time_start': time(6, 0),
                'collection_time_end': time(11, 0),
                'path_geojson': {
                    'type': 'LineString',
                    'coordinates': [
                        [30.0580, -1.9520],
                        [30.0590, -1.9530],
                        [30.0600, -1.9540],
                    ]
                },
            },
            # Kimironko Zone routes
            {
                'service_area_code': 'SA-002',
                'code': 'RT-003',
                'name': 'Route A - Monday/Wednesday/Friday',
                'description': 'Kimironko market and surroundings',
                'sequence_number': 1,
                'estimated_distance_km': 10.0,
                'estimated_duration_minutes': 240,
                'frequency': 'weekly',
                'collection_days': ['monday', 'wednesday', 'friday'],
                'collection_time_start': time(5, 30),
                'collection_time_end': time(12, 0),
                'path_geojson': {
                    'type': 'LineString',
                    'coordinates': [
                        [30.1078, -1.9403],
                        [30.1090, -1.9415],
                        [30.1100, -1.9425],
                        [30.1110, -1.9435],
                    ]
                },
            },
            {
                'service_area_code': 'SA-002',
                'code': 'RT-004',
                'name': 'Route B - Tuesday/Thursday/Saturday',
                'description': 'Kimironko residential north',
                'sequence_number': 2,
                'estimated_distance_km': 7.5,
                'estimated_duration_minutes': 180,
                'frequency': 'weekly',
                'collection_days': ['tuesday', 'thursday', 'saturday'],
                'collection_time_start': time(6, 0),
                'collection_time_end': time(11, 30),
                'path_geojson': {
                    'type': 'LineString',
                    'coordinates': [
                        [30.1050, -1.9380],
                        [30.1060, -1.9390],
                        [30.1070, -1.9400],
                    ]
                },
            },
            # Kicukiro Zone routes
            {
                'service_area_code': 'SA-003',
                'code': 'RT-005',
                'name': 'Route A - Daily',
                'description': 'Kicukiro commercial daily collection',
                'sequence_number': 1,
                'estimated_distance_km': 5.0,
                'estimated_duration_minutes': 120,
                'frequency': 'daily',
                'collection_days': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
                'collection_time_start': time(6, 0),
                'collection_time_end': time(10, 0),
                'path_geojson': {
                    'type': 'LineString',
                    'coordinates': [
                        [30.0897, -1.9774],
                        [30.0910, -1.9780],
                        [30.0920, -1.9790],
                    ]
                },
            },
            # Remera Zone routes
            {
                'service_area_code': 'SA-004',
                'code': 'RT-006',
                'name': 'Route A - Monday/Thursday',
                'description': 'Remera main commercial route',
                'sequence_number': 1,
                'estimated_distance_km': 9.0,
                'estimated_duration_minutes': 210,
                'frequency': 'twice_weekly',
                'collection_days': ['monday', 'thursday'],
                'collection_time_start': time(5, 30),
                'collection_time_end': time(11, 30),
                'path_geojson': {
                    'type': 'LineString',
                    'coordinates': [
                        [30.1048, -1.9575],
                        [30.1060, -1.9585],
                        [30.1070, -1.9595],
                        [30.1080, -1.9605],
                    ]
                },
            },
            {
                'service_area_code': 'SA-004',
                'code': 'RT-007',
                'name': 'Route B - Wednesday/Saturday',
                'description': 'Remera residential areas',
                'sequence_number': 2,
                'estimated_distance_km': 7.0,
                'estimated_duration_minutes': 165,
                'frequency': 'twice_weekly',
                'collection_days': ['wednesday', 'saturday'],
                'collection_time_start': time(6, 0),
                'collection_time_end': time(11, 0),
                'path_geojson': {
                    'type': 'LineString',
                    'coordinates': [
                        [30.1020, -1.9560],
                        [30.1030, -1.9570],
                        [30.1040, -1.9580],
                    ]
                },
            },
            # Nyamirambo Zone routes
            {
                'service_area_code': 'SA-005',
                'code': 'RT-008',
                'name': 'Route A - Tuesday/Friday',
                'description': 'Nyamirambo main collection route',
                'sequence_number': 1,
                'estimated_distance_km': 11.0,
                'estimated_duration_minutes': 270,
                'frequency': 'twice_weekly',
                'collection_days': ['tuesday', 'friday'],
                'collection_time_start': time(5, 30),
                'collection_time_end': time(12, 30),
                'path_geojson': {
                    'type': 'LineString',
                    'coordinates': [
                        [30.0453, -1.9789],
                        [30.0465, -1.9800],
                        [30.0475, -1.9810],
                        [30.0485, -1.9820],
                    ]
                },
            },
            {
                'service_area_code': 'SA-005',
                'code': 'RT-009',
                'name': 'Route B - Monday/Thursday',
                'description': 'Nyamirambo residential zone',
                'sequence_number': 2,
                'estimated_distance_km': 8.0,
                'estimated_duration_minutes': 195,
                'frequency': 'twice_weekly',
                'collection_days': ['monday', 'thursday'],
                'collection_time_start': time(6, 0),
                'collection_time_end': time(11, 30),
                'path_geojson': {
                    'type': 'LineString',
                    'coordinates': [
                        [30.0430, -1.9770],
                        [30.0440, -1.9780],
                        [30.0450, -1.9790],
                    ]
                },
            },
        ]

        # Map service area codes to objects
        area_map = {area.code: area for area in service_areas}
        
        routes = []
        collector_index = 0
        
        for data in routes_data:
            service_area = area_map.get(data.pop('service_area_code'))
            if not service_area:
                continue

            # Assign a collector (round-robin)
            assigned_collector = collectors[collector_index % len(collectors)]
            collector_index += 1

            route, created = Route.objects.update_or_create(
                code=data['code'],
                defaults={
                    **data,
                    'service_area': service_area,
                    'default_collector': assigned_collector,
                    'status': 'active',
                    'created_by': admin_user,
                }
            )
            routes.append(route)
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status}: {route.name} → Collector: {assigned_collector.full_name}')

        return routes

    def generate_schedules(self, routes):
        """Generate schedules for next 30 days based on route frequency"""
        today = date.today()
        
        day_name_to_number = {
            'monday': 0,
            'tuesday': 1,
            'wednesday': 2,
            'thursday': 3,
            'friday': 4,
            'saturday': 5,
            'sunday': 6,
        }
        
        schedules_created = 0
        
        for route in routes:
            collection_days = route.collection_days or []
            collection_day_numbers = [day_name_to_number.get(day.lower(), -1) for day in collection_days]
            collection_day_numbers = [d for d in collection_day_numbers if d >= 0]

            if not collection_day_numbers:
                # If no specific days, use route frequency
                if route.frequency == 'daily':
                    collection_day_numbers = list(range(6))  # Mon-Sat
                elif route.frequency == 'weekly':
                    collection_day_numbers = [0]  # Monday
                elif route.frequency == 'twice_weekly':
                    collection_day_numbers = [0, 3]  # Mon, Thu
                elif route.frequency == 'biweekly':
                    collection_day_numbers = [0]  # Every other Monday
                elif route.frequency == 'monthly':
                    collection_day_numbers = [0]  # First Monday

            # Generate schedules for next 30 days
            for day_offset in range(30):
                schedule_date = today + timedelta(days=day_offset)
                
                # Check if this day matches collection days
                if schedule_date.weekday() in collection_day_numbers:
                    # Check for biweekly (every other week)
                    if route.frequency == 'biweekly':
                        week_number = schedule_date.isocalendar()[1]
                        if week_number % 2 != 0:
                            continue
                    
                    # Check for monthly (first week only)
                    if route.frequency == 'monthly':
                        if schedule_date.day > 7:
                            continue

                    # Create schedule if not exists
                    schedule, created = Schedule.objects.get_or_create(
                        route=route,
                        scheduled_date=schedule_date,
                        defaults={
                            'collector': route.default_collector,
                            'scheduled_time_start': route.collection_time_start or time(6, 0),
                            'scheduled_time_end': route.collection_time_end or time(12, 0),
                            'status': 'scheduled',
                            'customers_scheduled': random.randint(20, 50),
                        }
                    )
                    if created:
                        schedules_created += 1

            self.stdout.write(f'  Generated schedules for: {route.name}')

        self.stdout.write(self.style.SUCCESS(f'  Total new schedules: {schedules_created}'))
