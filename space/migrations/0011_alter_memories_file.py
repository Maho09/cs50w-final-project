# Generated by Django 4.1.4 on 2023-02-11 22:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('space', '0010_alter_memories_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='memories',
            name='file',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]