from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    balance = models.IntegerField(default=0)
    currency = models.CharField(max_length=5, default='USD')
    emails = models.BooleanField(default=True)


class Goals(models.Model):
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owener_id")
    title = models.CharField(max_length=100)
    details = models.TextField()
    total = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    status = models.BooleanField(default=True)
    end_date = models.DateField(auto_now_add=False)


class Debts(models.Model):
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="debt_user_id")
    title = models.CharField(max_length=100)
    total = models.IntegerField(default=0)
    amount = models.IntegerField(default=0)
    due_date = models.DateField(auto_now_add=False)


class Income(models.Model):
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="income_user")
    title = models.CharField(max_length=100)
    amount = models.IntegerField(default=0)
    frequency = models.CharField(max_length=20, default="monthly")
    due_date = models.DateField(auto_now_add=False)


class Expense(models.Model):
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="expense_user")
    title = models.CharField(max_length=100)
    price = models.IntegerField(default=0)
    category = models.CharField(max_length=100, default="")
    date = models.DateField(auto_now_add=True)


class Events(models.Model):
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="event_user_id")
    title = models.CharField(max_length=100)
    info = models.TextField(default="")
    date = models.DateTimeField(auto_now_add=False)
    sent = models.BooleanField(default = False)


class Memories(models.Model):
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    details = models.TextField()
    file = models.ImageField(null=True, blank=True, upload_to="images/")


class Notes(models.Model):
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="note_user_id")
    title = models.CharField(max_length=100)
    details = models.TextField()
