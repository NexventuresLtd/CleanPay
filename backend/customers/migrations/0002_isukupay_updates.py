# Generated migration for IsukuPay updates

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='card_number',
            field=models.CharField(blank=True, help_text='8-digit IsukuPay card number for customer login', max_length=8, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='customer',
            name='service_provider',
            field=models.CharField(blank=True, help_text='Name of the waste collection service provider (e.g., C&GS Ltd)', max_length=255),
        ),
        migrations.AddField(
            model_name='customer',
            name='prepaid_balance',
            field=models.IntegerField(default=0, help_text='Number of remaining waste collections'),
        ),
        migrations.AlterField(
            model_name='customer',
            name='billing_address',
            field=models.JSONField(blank=True, default=dict, help_text='JSON format: {district, sector, cell, village, street}'),
        ),
        migrations.RemoveField(
            model_name='customer',
            name='shipping_address',
        ),
    ]
