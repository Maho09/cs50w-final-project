# Generated by Django 4.1.4 on 2023-02-11 22:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('space', '0009_alter_memories_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='memories',
            name='file',
            field=models.ImageField(height_field=50, upload_to='space/uploads/', width_field=50),
        ),
    ]