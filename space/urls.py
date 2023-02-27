from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("show/<str:topic>", views.show, name="show"),
    path("add_goal", views.add_goal, name="add_goal"),
    path("add_income", views.add_income, name="add_income"),
    path("add_debt", views.add_debt, name="add_debt"),
    path("add_expense", views.add_expense, name="add_expense"),
    path("edit/<int:id>/<str:topic>", views.edit, name="edit"),
    path("delete/<int:id>/<str:topic>", views.delete, name="delete"),
    path("change_password", views.change_password, name="change_password"),
    path("balance", views.balance, name="balance"),
    path("notes", views.notes, name="notes"),
    path("memories", views.memories, name="memories"),
    path("events", views.events, name="events"),
]
