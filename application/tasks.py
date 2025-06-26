from celery import shared_task
from .models import User, Score
from .utils import format_report
from .mail import send_email
import datetime
import csv 
import requests
import pytz

# ADD this timezone definition
IST = pytz.timezone('Asia/Kolkata')

@shared_task(ignore_results = False,name = "download_csv_report")
def csv_report(user_id):
    user = User.query.get(user_id)
    if not user:
        return "User not found"
    scores = Score.query.filter_by(user_id=user_id).all()
    current_time_ist = datetime.datetime.now(IST)
    csv_file_name = f"quiz_data_{user.fullname}_{current_time_ist.strftime('%Y%m%d_%H%M%S')}.csv"
    with open(f'static/{csv_file_name}', 'w', newline = "") as csvfile:
        sr_no = 1
        quiz_csv = csv.writer(csvfile, delimiter = ',')
        quiz_csv.writerow(['Sr No.', 'Score Id', 'Quiz Id', 'Score', 'date_of_quiz'])
        for s in scores:
            this_score = [sr_no,s.id,s.quiz_id,s.score,s.attempt_date]
            quiz_csv.writerow(this_score)
            sr_no += 1
    return csv_file_name

@shared_task(ignore_results = False,name = "Daily reminders")
def daily_report(fullname):
    text = f"Hi {fullname}, new Quiz has been uploaded. Please check the app at http://127.0.0.1:5000"
    response = requests.post("https://chat.googleapis.com/v1/spaces/AAQAxXGhhfg/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=b5q8SiW8kps1E3Ql8tXG0tMv8J_y00YxLA5qnGXX0Js", json = {"text": text})
    # print(response.status_code)
    
    return "Daily reminders sent"

@shared_task(ignore_results = False,name = "Monthly Activity Report")
def monthly_report():
    users = User.query.all()
    for user in users[1:]:
        user_data={}
        user_data["id"] = user.id
        user_data['fullname'] = user.fullname
        user_data['email'] = user.email
        user_score = []
        scores = Score.query.filter_by(user_id=user.id).all()
        for score in scores:
            this_score = {}
            this_score["id"] = score.id
            this_score["quiz_id"] = score.quiz_id
            this_score["score"] = score.score
            this_score["date_of_attempt"] = score.attempt_date
            user_score.append(this_score)

        user_data["scores"] = user_score

        message = format_report('templates/mail_details.html',user_data)
        send_email(user.email, subject = "Monthly Quiz Report - Quiz Master", message = message)
    return "Monthly Activity Report sent"