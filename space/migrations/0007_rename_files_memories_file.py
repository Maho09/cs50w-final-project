# Generated by Django 4.1.4 on 2023-02-10 18:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('space', '0006_goals_total'),
    ]

    operations = [
        migrations.RenameField(
            model_name='memories',
            old_name='files',
            new_name='file',
        ),
    ]