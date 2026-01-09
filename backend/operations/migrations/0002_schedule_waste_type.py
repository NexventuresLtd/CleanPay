# Generated migration for waste type in schedules

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('operations', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='schedule',
            name='waste_type',
            field=models.CharField(
                choices=[
                    ('biodegradable', 'Biodegradable'),
                    ('non_biodegradable', 'Non-Biodegradable'),
                    ('mixed', 'Mixed')
                ],
                default='mixed',
                help_text='Type of waste to be collected',
                max_length=20
            ),
        ),
    ]
