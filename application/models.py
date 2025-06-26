from flask_security import UserMixin,RoleMixin
from .database import db 
from datetime import datetime as dt , timedelta
import uuid

class User(db.Model, UserMixin ):
    id=db.Column(db.Integer(),primary_key=True)
    email=db.Column(db.String(),unique=True,nullable=False)
    fullname=db.Column(db.String(),nullable=False,)
    qualification=db.Column(db.String())
    dob=db.Column(db.String())
    password=db.Column(db.String(),nullable=False)
    fs_uniquifier = db.Column(db.String,unique=True,nullable=False)
    active =db.Column(db.Boolean,nullable=False)
    roles = db.relationship('Role', backref = 'bearer', secondary = 'users_roles')
    scores = db.relationship('Score', backref='user', lazy=True)

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False)
    description = db.Column(db.String)

# many-to-many
class UsersRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class Subject(db.Model):
    id = db.Column(db.Integer(), primary_key=True,unique=True)
    name = db.Column(db.String(), nullable=False,unique=True)
    description = db.Column(db.Text())
    chapters = db.relationship('Chapter', backref='subject', lazy='dynamic')

class Chapter(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), nullable=False, unique=True)
    description = db.Column(db.Text())
    subject_id = db.Column(db.Integer(), db.ForeignKey('subject.id'), nullable=False)
    quizzes = db.relationship('Quiz', backref='chapter', lazy='dynamic')

class Quiz(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    chapter_id = db.Column(db.Integer(), db.ForeignKey('chapter.id'), nullable=False)
    date_of_quiz = db.Column(db.String(), nullable = False)
    time_duration = db.Column(db.Integer(),nullable=False)  # in minutes
    questions = db.relationship('Question', backref='quiz', lazy='dynamic')
    scores = db.relationship('Score', backref='quiz', lazy=True, cascade="all, delete-orphan")



class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    option1 = db.Column(db.String(), nullable=False)
    option2 = db.Column(db.String(), nullable=False)
    option3 = db.Column(db.String(), nullable=False)
    option4 = db.Column(db.String(), nullable=False)
    correct_option = db.Column(db.Integer, nullable=False)
class Score(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)
    quiz_id = db.Column(db.Integer(), db.ForeignKey('quiz.id'), nullable=False)
    score = db.Column(db.Integer(), nullable=False)
    attempt_date = db.Column(db.String())
