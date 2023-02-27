# Generated by Django 4.1.4 on 2023-02-06 18:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('space', '0002_user_currency'),
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('price', models.IntegerField(default=0)),
                ('date', models.DateField(auto_now_add=True)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='expense_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]