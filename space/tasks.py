from __future__ import absolute_import, unicode_literals
from celery import shared_task
from myspace.celery import app
from .models import User, Events
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send():
   # getting tommorow's date
    time_threshold = datetime.now() + timedelta(hours=24)
    # selecting events with tommorow's date that the user didn't get an email about
    eventss = Events.objects.filter(
        sent=False, date__date=time_threshold.date())
    # looping through those events
    # sending the email to each user
    for event in eventss:
        print(event.date.date())
        user = User.objects.get(username=event.user_id)
        send_mail(f"reminder about {event.title}", f"Your event '{event.title}' is happening tommorow\n Details:\n {event.info}",
                  "erenyaarmin5000@gmail.com", [user.email], fail_silently=False)
        event.sent = True
        event.save()
