# Generated by Django 4.1.4 on 2023-02-06 15:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('space', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='currency',
            field=models.CharField(default='USD', max_length=5),
        ),
    ]