# Generated by Django 4.1.4 on 2023-02-07 00:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('space', '0004_expense_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='debts',
            name='due_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='goals',
            name='end_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='income',
            name='due_date',
            field=models.DateField(),
        ),
    ]
