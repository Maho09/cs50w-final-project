# Generated by Django 4.1.4 on 2023-02-11 22:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('space', '0008_alter_memories_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='memories',
            name='file',
            field=models.ImageField(blank=True, upload_to=''),
        ),
    ]