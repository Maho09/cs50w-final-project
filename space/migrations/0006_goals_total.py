# Generated by Django 4.1.4 on 2023-02-09 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('space', '0005_alter_debts_due_date_alter_goals_end_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='goals',
            name='total',
            field=models.IntegerField(default=0),
        ),
    ]
