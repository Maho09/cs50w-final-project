from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Goals, Debts, Income, Events, Memories, Notes, Expense
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password
from datetime import timedelta
from django.forms import ModelForm, TextInput
from datetime import datetime
from django.core.mail import send_mail

# form that submits to Memories model


class MemoForm(ModelForm):
    class Meta:
        model = Memories
        fields = ['title', 'details',
                  'file']
        widgets = {
            "title": TextInput(attrs={"class": 'form-control', 'placeholder': 'Title'},),
            "details": TextInput(attrs={"class": 'form-control', 'placeholder': 'Details'},)
        }


# Create your views here.
# the index view for the budget part of the app
def index(request):
    # getting the current user
    user = request.user
    # getting the current user's expenses
    expenses = Expense.objects.filter(user_id=user.id)
    # array for the user's categories in Expenses model
    categories = []
    category_spends = []
    price_p = 0
    total_spent = 0
    # looping through the queried expenses to get the total spent and collecting the categories into categories array
    for item in expenses:
        total_spent += item.price
        if item.category not in categories:
            categories.append(item.category)
    # looping through the categories array to calculate the amount spent on each category and the percentage to the total spent and adding them as an array inside the  category_spends array
    for category in categories:
        price_p = 0
        price_col = Expense.objects.filter(
            category=category)
        for row in price_col:
            price_p += row.price
        pe = round(price_p/total_spent*100, 2)
        percentage = f"{pe}%"
        category_spends.append([category, price_p, percentage])
    # returning render the index.html with the category_spends array and the total spent
    return render(request, "space/index.html", {
        "expenses": category_spends,
        "total": total_spent
    })
    ...


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "space/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "space/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "space/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "space/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "space/register.html")

# An api that is utilized by JavaScript to get an array of dictionaries corresponding to the rows in the queryset debending on the variable topic and oredering them by date


def show(request, topic):
    if topic == "goals":
        pack = Goals.objects.filter(
            user_id=request.user).order_by("end_date").values()
    elif topic == "income":
        pack = Income.objects.filter(
            user_id=request.user).order_by("due_date").values()
    elif topic == "debts":
        pack = Debts.objects.filter(
            user_id=request.user).order_by("due_date").values()
    elif topic == "expenses":
        pack = Expense.objects.filter(
            user_id=request.user).order_by("-date").values()
    else:
        return JsonResponse({"error": "Invalid topic."}, status=400)

    return JsonResponse([item for item in pack], safe=False)

# this view is used to add to the Goals model


@login_required
def add_goal(request):
    if request.method == "POST":
        curr_user = request.user
        title = request.POST["title"]
        details = request.POST["details"]
        budget = request.POST["budget"]
        date = request.POST["date"]
        goal = Goals(user_id=curr_user, title=title, details=details,
                     total=budget, price=budget, end_date=date, status=True)
        goal.save()
        return HttpResponseRedirect(reverse("index"))

# this view is used to add to the Income model


@login_required
def add_income(request):
    if request.method == "POST":
        curr_user = request.user
        title = request.POST["title"]
        amount = request.POST["budget"]
        frequency = request.POST["frequency"]
        date = request.POST["date"]
        income = Income(user_id=curr_user, title=title,
                        amount=amount, frequency=frequency, due_date=date)
        income.save()
        return HttpResponseRedirect(reverse("index"))

# this view is used to add to the Debt model


@login_required
def add_debt(request):
    if request.method == "POST":
        curr_user = request.user
        title = request.POST["title"]
        amount = request.POST["budget"]
        date = request.POST["date"]
        debt = Debts(user_id=curr_user, title=title,
                     total=amount, amount=amount, due_date=date)
        debt.save()
        return HttpResponseRedirect(reverse("index"))

# this view is used to add to the Expense model


@login_required
def add_expense(request):
    if request.method == "POST":
        curr_user = request.user
        title = request.POST["title"]
        amount = int(request.POST["price"])
        category = request.POST["category"]
        expense = Expense(user_id=curr_user, title=title,
                          price=amount, category=category)
        curr_user.balance -= int(amount)
        curr_user.save()

        expense.save()
        return HttpResponseRedirect(reverse("index"))

# this view is an api used to edit on existing data depending on the topic and the id (refering to the user foreign key) in the models that are recieved from the javascript


@login_required
def edit(request, id, topic):
    if request.method == "PUT":
        if topic == "goals":
            # making sure the received id is correct
            try:
                goal = Goals.objects.get(pk=id)
            except Goals.DoesNotExist:
                return JsonResponse({"error": "goal not found."}, status=404)
            # loading the data
            data = json.loads(request.body)
            # ensuring the data contains the title of the goal and editting the goal
            if data.get("title"):
                goal.title = data["title"]
                goal.details = data["details"]
                goal.price = data["price"]
                goal.end_date = data["date"]
                goal.save()
                return HttpResponseRedirect(reverse("index"))

        elif topic == "income":
            # making sure the received id is correct
            try:
                income = Income.objects.get(pk=id)
            except Income.DoesNotExist:
                return JsonResponse({"error": "theis income was not found."}, status=404)
            # loading the data
            data = json.loads(request.body)
            # ensuring the data contains the title of the income and editting the income
            if data.get("title"):
                income.title = data["title"]
                income.amount = data["price"]
                income.due_date = data["date"]
                income.save()
                return HttpResponseRedirect(reverse("index"))

        elif topic == "debts":
            # making sure the received id is correct
            try:
                debt = Debts.objects.get(pk=id)
                user = request.user
            except Debts.DoesNotExist:
                return JsonResponse({"error": "theis income was not found."}, status=404)
            # loading the data
            data = json.loads(request.body)
            # ensuring the data contains the price of the debt and editting the debt
            if data.get("price"):
                price = data["price"]
                debt.amount -= int(price)
                user.balance -= int(price)
                user.save()
                # if the debt is completely paid delete the debt
                if debt.amount == 0:
                    debt.delete()
                    ...
                else:
                    debt.save()
                return HttpResponseRedirect(reverse("index"))
        # saving what the user saved in any goal
        elif topic == "save_goal":
            # making sure the received id is correct
            try:
                goal = Goals.objects.get(pk=id)
                user = request.user
            except Debts.DoesNotExist:
                return JsonResponse({"error": "theis income was not found."}, status=404)
            # loading the data
            data = json.loads(request.body)
            # ensuring the data contains the amount saved by the user and editting the goal and applying the effects on the user's balance
            if data.get("amount"):
                amount = data["amount"]
                goal.price -= int(amount)
                goal.save()
                user.balance -= int(amount)
                user.save()
                return HttpResponseRedirect(reverse("index"))
            else:
                return JsonResponse({"error": "theis income was not found."}, status=404)
        # when the user marks income as recieved
        elif topic == "mark":
            # making sure the received id is correct
            try:
                income = Income.objects.get(pk=id)
                user = request.user
            except Debts.DoesNotExist:
                return JsonResponse({"error": "theis income was not found."}, status=404)
            # adding the income to the balance
            user.balance += income.amount
            user.save()
            # if the frequency of the income is monthly change the due date accordingly other wise delete the income from the database
            if income.frequency == "monthly":
                res = (income.due_date +
                       timedelta(days=30)).strftime('%Y-%m-%d')
                income.due_date = res
                income.save()
                print(res)
                return JsonResponse(res, safe=False)
            else:
                income.delete()
            return JsonResponse("deleted", safe=False)
        # editing a memory
        elif topic == "memo":
            # making sure the received id is correct
            try:
                memo = Memories.objects.get(pk=id)
                user = request.user
            except Debts.DoesNotExist:
                return JsonResponse({"error": "theis income was not found."}, status=404)
            # loading the data
            data = json.loads(request.body)
            # ensuring the inputs are present and editing
            if data.get("title"):
                memo.title = data["title"]
                memo.details = data["details"]
                memo.save()
                return HttpResponseRedirect(reverse("memories"))
                ...
        # editing an event
        elif topic == "event":
            # making sure the received id is correct
            try:
                event = Events.objects.get(pk=id)
                user = request.user
            except Debts.DoesNotExist:
                return JsonResponse({"error": "theis income was not found."}, status=404)
            # loading the data
            data = json.loads(request.body)
            # ensuring the inputs are present and editing
            if data.get("title"):
                event.title = data["title"]
                event.details = data["details"]
                event.date = data["date"]
                event.save()
                return HttpResponseRedirect(reverse("memories"))

        # editing a note
        elif topic == "note":
            # making sure the received id is correct
            try:
                note = Notes.objects.get(pk=id)
                user = request.user
            except Debts.DoesNotExist:
                return JsonResponse({"error": "theis income was not found."}, status=404)
            # loading the data
            data = json.loads(request.body)
            # ensuring the inputs are present and editing
            if data.get("title"):
                note.title = data["title"]
                note.details = data["details"]
                note.save()
                return HttpResponseRedirect(reverse("memories"))

# view to delete from the database


@login_required
def delete(request, id, topic):
    if request.method == "DELETE":
        # delete a goal
        if topic == "goals":
            goal = Goals.objects.get(pk=id)
            goal.delete()
            return HttpResponseRedirect(reverse("index"))
        # delete an income
        elif topic == "income":
            income = Income.objects.get(pk=id)
            income.delete()
            return HttpResponseRedirect(reverse("index"))
        # delete a debt
        elif topic == "debts":
            debt = Debts.objects.get(pk=id)
            debt.delete()
            return HttpResponseRedirect(reverse("index"))
        # delete a note
        elif topic == "note":
            note = Notes.objects.get(pk=id)
            note.delete()
            return HttpResponseRedirect(reverse("notes"))
        # delete a memory
        elif topic == "memo":
            memo = Memories.objects.get(pk=id)
            memo.delete()
            return HttpResponseRedirect(reverse("notes"))
        # delete an event
        elif topic == "event":
            event = Events.objects.get(pk=id)
            event.delete()
            return HttpResponseRedirect(reverse("events"))

# view to change the password


def change_password(request):
    if request.method == "POST":
        # getting the user
        user = User.objects.get(pk=request.POST["id"])
        # collecting old password hash from data base for comparison with the new password
        old = user.password
        new = request.POST["pass"]
        confirmation = request.POST["pass2"]
        # checking that the user typed the password correctly and throwing an error if not
        if not new == confirmation:
            return render(request, "space/pass.html",
                          {
                              "message": "the password and the confirmation don't match"
                          })
        # checking if the user the old password and throwing an error if so
        elif check_password(new, old):
            return render(request, "space/pass.html",
                          {
                              "message": "don't use the same password"
                          })
        # sacing the new password
        else:
            user.set_password(new)
            user.save()
            login(request, user)
            return render(request, "space/pass.html", {
                "success": "Password changed successfully"
            })
    # in case of get request
    else:
        return render(request, "space/pass.html",
                      )

# editting the user's balance


def balance(request):
    if request.method == "POST":
        user = request.user
        # checking if the user is adding to his balance
        if request.POST['balance']:
            new = request.POST['balance']
            user.balance += int(new)
            user.save()
        # checking if the user is adjusting his balance
        elif request.POST['new_balance']:
            new = request.POST['new_balance']
            user.balance = int(new)
            user.save()
        return HttpResponseRedirect(reverse("index"))
    # in case of get request
    else:
        return render(request, "space/balance.html")

# view to create notes


def notes(request):
    user = request.user
    if request.method == "POST":
        # getting user inputs and saving to the notes model
        title = request.POST["title"]
        details = request.POST["details"]
        note = Notes(user_id=user, title=title, details=details)
        note.save()
        notes = Notes.objects.filter(user_id=user.id)
        return render(request, "space/notes.html", {
            "notes": notes
        })

    else:
        # checking if the user has no notes
        try:
            notes = Notes.objects.filter(user_id=user.id)
        except Notes.DoesNotExist:
            notes = ""
        return render(request, "space/notes.html", {
            "notes": notes
        })

# view to create memories


def memories(request):
    user = request.user
    if request.method == "POST":
        ...
        # the memory form that submits to the Memories model
        form = MemoForm(request.POST, request.FILES)
        if form.is_valid():
            # saving the inputs without commiting
            memon = form.save(commit=False)
            # adding the user id and commiting
            memon.user_id = user
            memon.save()
        memories = Memories.objects.filter(user_id=user.id)
        return render(request, "space/memo.html", {
            "form": form,
            "memos": memories
        })
    # in case of get request
    else:
        # the memory form that submits to the Memories model
        form = MemoForm()
        # checking if the user has no memories
        try:
            memories = Memories.objects.filter(user_id=user.id)
        except Memories.DoesNotExist:
            memories = ""
        return render(request, "space/memo.html", {
            "form": form,
            "memos": memories
        })

# view to create events


def events(request):
    user = request.user
    if request.method == "POST":
        title = request.POST["title"]
        details = request.POST["details"]
        time = request.POST["time"]
        event = Events(user_id=user, title=title, info=details, date=time)
        event.save()
        events = Events.objects.filter(user_id=user.id)
        return render(request, "space/events.html", {
            "events": events
        })
        ...
    else:
        events = Events.objects.filter(user_id=user.id)
        return render(request, "space/events.html", {
            "events": events
        })
