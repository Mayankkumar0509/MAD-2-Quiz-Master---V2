from .database import db
from .models import *
from flask import current_app as app,jsonify,request,session,render_template,send_from_directory
from flask_security import hash_password, auth_required,roles_required,current_user,roles_accepted,login_user
from werkzeug.security import check_password_hash,generate_password_hash
from .utils import roles_list
from celery.result import AsyncResult
from .tasks import csv_report,monthly_report
from datetime import datetime, timedelta
import pytz


IST = pytz.timezone('Asia/Kolkata')
cache = app.cache
 
@app.route('/', methods = ['GET'])
def home():
    return render_template('index.html')

@app.get('/cache')
@cache.cached(timeout = 5)
def cache():
    return{'time' : str(datetime.now())}


@app.route('/api/admin')
@auth_required('token')
@roles_required('admin')
def admin_home():
    user = current_user
    return jsonify({
        "email":user.email,
        "password":user.password,
        "fullname":user.fullname,
        "qualification":user.qualification,
        "dob":user.dob,
        "role":roles_list(user.roles)
    })

@app.route('/api/home')
@auth_required('token')
@roles_required('user')
def user_home():
    user = current_user
    return jsonify({
        "id":user.id,
        "email":user.email,
        "password":user.password,
        "fullname":user.fullname,
        "qualification":user.qualification,
        "dob":user.dob,
        "role":roles_list(user.roles)
    })

@app.route('/api/login', methods=['POST'])
def user_login():
    body = request.get_json()
    email = body['email']
    password = body['password']

    if not email:
        return jsonify({
            "message":"Email is required"
        }),400
    user = app.security.datastore.find_user(email=email)

    if user:
        if check_password_hash(user.password , password):
            # if current_user:
            #     return jsonify({
            #         "message":"User Already logged in!"
            #     })
            login_user(user)
            return jsonify({
                "id" : user.id,
                "fullname" : user.fullname,
                "qualification" : user.qualification,
                "dob" : user.dob,
                 "role":roles_list(user.roles),
                "auth-token" : user.get_auth_token()
            })
        else:
            return jsonify({
                "message":"wrong password"
            }),400
    else:
         return jsonify({
                "message":"user not found"
            }),404

@app.post('/api/register')
def create_user():
    credentials = request.get_json()
    if not app.security.datastore.find_user(email = credentials["email"]):
        app.security.datastore.create_user(email = credentials["email"],fullname =credentials["fullname"],qualification = credentials["qualification"],dob = credentials["dob"],password = generate_password_hash(credentials["password"]),roles = ['user'])
        db.session.commit()
        return jsonify({
            "message":"User created successfully"
        }),201
    
    return jsonify({
            "message":"User already exists!"
        }),400

@app.route("/api/start_quiz/<int:quiz_id>", methods=["GET"])
@auth_required('token')
@roles_accepted('user', 'admin')
def start_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    
    # Get all questions for this quiz
    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    
    # If no questions, redirect back with message
    if not questions:
        return {
            "message":"This quiz has no questions yet!"
        }
    
    # Calculate end time for the quiz
    # start_time = dt.now()
    start_time = datetime.now(IST)
    end_time = start_time + timedelta(minutes=quiz.time_duration)
    session['quiz_start_time'] = start_time.timestamp()
    session['quiz_end_time'] = end_time.timestamp()
    session['current_quiz_id'] = quiz_id
    
    # Return first question
    return {
        "message":"quiz started"
    }




# Add this new route to your existing routes.py file

@app.route("/api/submit_quiz", methods=["POST"])
@auth_required('token')
@roles_accepted('user', 'admin')
def submit_quiz():
    try:
        # Get data from request
        data = request.get_json()
        quiz_id = data.get('quiz_id')
        score = data.get('score')
        
        if not quiz_id or score is None:
            return jsonify({
                "message": "Quiz ID and score are required"
            }), 400
        
        # Verify quiz exists
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({
                "message": "Quiz not found"
            }), 404
        
        # Create score record
        # from datetime import datetime
        # new_score = Score(
        #     user_id=current_user.id,
        #     quiz_id=quiz_id,
        #     score=score,
        #     attempt_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # )
        current_time_ist = datetime.now(IST)
        new_score = Score(
            user_id=current_user.id,
            quiz_id=quiz_id,
            score=score,
            attempt_date=current_time_ist.strftime("%Y-%m-%d %H:%M:%S")
        )
                
        db.session.add(new_score)
        db.session.commit()
        
        return jsonify({
            "message": "Quiz submitted successfully",
            "score": score,
            "quiz_id": quiz_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": f"Error submitting quiz: {str(e)}"
        }), 500

@app.route('/api/export/<id>')
def export_csv(id):
    result = csv_report.delay(id)
    return jsonify({
        "id": result.id,
        "result": result.result,
    })

@app.route('/api/csv_result/<id>')
def csv_result(id):
    res = AsyncResult(id)
    return send_from_directory('static',res.result)


@app.route('/api/mail')
def send_reports():
    res = monthly_report.delay()
    return {
        "result": res.result
    }