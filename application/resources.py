from flask_restful import Api,Resource,reqparse
from .models import *
from flask_security import auth_required, roles_required,roles_accepted,current_user
import datetime
from .utils import roles_list
from .tasks import daily_report
from flask_caching import Cache
from flask import current_app as app

api = Api()
# app.config['CACHE_TYPE']='RedisCache'
# app.config['CACHE_DEFAULT_TIMEOUT']=300
# cache = Cache(app)
cache = app.cache

api = Api()

class subjectApi(Resource):
    # @cache.cached(timeout=300, key_prefix='subject_data')
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self):
        subjects = []
        subject_jsons =[]

        subjects =Subject.query.all()
        for subject in subjects:
            this_subject = {}
            this_subject["id"] = subject.id
            this_subject["name"] = subject.name
            this_subject["description"] = subject.description
            subject_jsons.append(this_subject)

        if subject_jsons:
            return subject_jsons
        
        return{
            "message": "No subject found"
        },404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('description')
        args = parser.parse_args()
        existing = Subject.query.filter_by(name=args['name']).first()
        if existing:
            return{
                "message": "Subject with this name already exists"
                },404
        try:
            
            subject = Subject(name=args['name'], description=args['description'])
            db.session.add(subject)
            db.session.commit()
            return {
                    "message": "subject added successfully!"
                }
        except:
            return {
                "message": "One or more required fields are missing"
            }, 400
        
    @auth_required('token')
    @roles_required('admin')
    def put(self, subject_id):
        subject = Subject.query.get(subject_id)
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('description')
        args = parser.parse_args()
        
        # Check if the new name conflicts with another subject
        existing = Subject.query.filter_by(name=args['name']).first()
        if existing and existing.id != subject_id:
            return{
                "message": "Another subject with this name already exists"
                },404
        subject.name = args['name']
        subject.description = args['description']
        db.session.commit()
        return {
                    "message": "subject updated successfully!"
                }
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, subject_id):
        subject = Subject.query.get(subject_id)
        if subject:
        
            chapters = Chapter.query.filter_by(subject_id=subject_id).all()
        
        # For each chapter, delete all quizzes and their questions
            for chapter in chapters:
                # Get all quizzes for this chapter
                quizzes = Quiz.query.filter_by(chapter_id=chapter.id).all()
                
                # For each quiz, delete all questions and scores
                for quiz in quizzes:
                    # Delete all questions for this quiz
                    Question.query.filter_by(quiz_id=quiz.id).delete()
                    
                    # Delete all scores for this quiz
                    Score.query.filter_by(quiz_id=quiz.id).delete()
                
                # Delete all quizzes for this chapter
                Quiz.query.filter_by(chapter_id=chapter.id).delete()
            
            # Delete all chapters for this subject
            Chapter.query.filter_by(subject_id=subject_id).delete()
            
            db.session.delete(subject)
            db.session.commit()
            return {'message': 'Subject deleted successfully'}
        else:
            return {
                "message": "subject not found!"
            }, 404


    
class chapterApi(Resource):
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self):
        chapters = []
        chapter_jsons =[]

        chapters = Chapter.query.all()
        for chapter in chapters:
            this_chapter = {}
            this_chapter["id"] = chapter.id
            this_chapter["name"] = chapter.name
            this_chapter["description"] = chapter.description
            this_chapter["subject_id"] = chapter.subject.id
            chapter_jsons.append(this_chapter)

        if chapter_jsons:
            return chapter_jsons
        
        return{
            "message": "No chapter found"
        },404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('description')
        parser.add_argument('subject_id')
        args = parser.parse_args()
        
        # Check if subject exists
        subject = Subject.query.filter_by(id=args['subject_id']).first()
        if not subject:
            return{
                "message": "Subject with this id not exists"
                },404
        
        # Check if chapter name is unique
        existing = Chapter.query.filter_by(name=args['name']).first()
        if existing:
            return{
                "message": "chapter with this name already exists"
                },404
        try:
            chapter = Chapter(
                name=args['name'], 
                description=args['description'], 
                subject_id=args['subject_id']
            )
            db.session.add(chapter)
            db.session.commit()
            return {
                        "message": "chapter added successfully!"
                    }
        except:
            return {
                "message": "One or more required fields are missing"
            }, 400
        
    @auth_required('token')
    @roles_required('admin')
    def put(self, chapter_id):
        chapter = Chapter.query.get(chapter_id)
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('description')
        parser.add_argument('subject_id')
        args = parser.parse_args()
        
        # Check if subject exists
        # subject = Subject.query.get_or_404(args['subject_id'])
        
        # Check if the new name conflicts with another chapter
        existing = Chapter.query.filter_by(name=args['name']).first()
        if existing and existing.id != chapter_id:
            return{
                "message": "Another chapter with this name already exists"
                },404
        
        subject = Subject.query.filter_by(id=args['subject_id']).first()
        if not subject:
            return{
                "message": "Subject with this id not exists"
                },404
        
        chapter.name = args['name']
        chapter.description = args['description']
        chapter.subject_id = args['subject_id']
        db.session.commit()
        return {
                    "message": "chapter updated successfully!"
                }
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, chapter_id):
        chapter = Chapter.query.get(chapter_id)
        if chapter:
        
            quizzes = Quiz.query.filter_by(chapter_id=chapter_id).all()   
            for quiz in quizzes:
                
                Question.query.filter_by(quiz_id=quiz.id).delete()
                Score.query.filter_by(quiz_id=quiz.id).delete()
            Quiz.query.filter_by(chapter_id=chapter_id).delete()
            
            db.session.delete(chapter)
            db.session.commit()
            return {
                        "message":" Chapter deleted successfully"
                    }
        else:
            return {
                "message": "chapter not found!"
            }, 404
    

class quizApi(Resource):
    # @cache.cached(timeout=300, key_prefix='Quiz_data')
    @auth_required('token')
    @cache.memoize(timeout = 5, )
    @roles_accepted('user', 'admin')
    def get(self):
        quizs = []
        quiz_jsons =[]

        quizs = Quiz.query.all()
        for quiz in quizs:
            this_quiz = {}
            this_quiz["id"] = quiz.id
            this_quiz["chapter_id"] = quiz.chapter_id
            this_quiz["chapter_name"] = quiz.chapter.name  
            this_quiz["subject_name"] = quiz.chapter.subject.name 
            this_quiz["date_of_quiz"] = quiz.date_of_quiz
            this_quiz["time_duration"] = quiz.time_duration
            
            # Count questions for this quiz
            question_count = Question.query.filter_by(quiz_id=quiz.id).count()
            this_quiz["question_count"] = question_count
            quiz_jsons.append(this_quiz)

        if quiz_jsons:
            return quiz_jsons
        
        return{
            "message": "No quiz found"
        },404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('chapter_id')
        # parser.add_argument('date_of_quiz')
        parser.add_argument('time_duration', type=int)
        args = parser.parse_args()
        chapter = Chapter.query.filter_by(id=args['chapter_id']).first()
        users = User.query.all()
        if not chapter:
            return{
                "message": "chapter with this id not exists"
                },404
        try:
            quiz = Quiz(
            chapter_id=args['chapter_id'], 
            date_of_quiz=datetime.datetime.now(), 
            time_duration=args['time_duration'])

            db.session.add(quiz)
            db.session.commit()
            for user in users[1:]:
                result = daily_report.delay(user.fullname)
            return {
                        "message": "quiz added successfully!"
                    }
        except:
            return {
                "message": "One or more required fields are missing"
            }, 400
        
    @auth_required('token')
    @roles_required('admin')
    def put(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        parser = reqparse.RequestParser()
        parser.add_argument('chapter_id', type=int, required=True, help='Chapter ID is required')
        parser.add_argument('date_of_quiz', type=str, required=True, help='Date is required (YYYY-MM-DD)')
        parser.add_argument('time_duration', type=int, required=True, help='Duration in minutes is required')
        args = parser.parse_args()
        chapter = Chapter.query.filter_by(id=args['chapter_id']).first()
        if not chapter:
            return{
                "message": "chapter with this id not exists"
                },404
        quiz.chapter_id = args['chapter_id']
        quiz.date_of_quiz = args['date_of_quiz']
        quiz.time_duration = args['time_duration']
        db.session.commit()
        return{
                    "message": "quiz updated successfully!"
                    }
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if quiz:
            Question.query.filter_by(quiz_id=quiz_id).delete()
            Score.query.filter_by(quiz_id=quiz_id).delete()

            db.session.delete(quiz)
            db.session.commit()
            return {'message': 'Quiz deleted successfully'}, 200
        else:
            return{
                "message":"quiz not found"
            }
        
        

class questionApi(Resource):
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self):
        questions = []
        question_jsons =[]

        questions = Question.query.all()
        for question in questions:
            this_question = {}
            this_question["id"] = question.id
            this_question["quiz_id"] = question.quiz.id
            this_question["option1"] = question.option1
            this_question["option2"] = question.option2
            this_question["option3"] = question.option3
            this_question["option4"] = question.option4
            this_question["question_text"] = question.question_text
            this_question["correct_option"] = question.correct_option
            question_jsons.append(this_question)

        if question_jsons:
            return question_jsons
        
        return{
            "message": "No question found"
        },404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('quiz_id')
        parser.add_argument('question_text')
        parser.add_argument('option1')
        parser.add_argument('option2')
        parser.add_argument('option3')
        parser.add_argument('option4')
        parser.add_argument('correct_option', type=int, required=True, help='Correct option is required (1-4)')
        args = parser.parse_args()
        quiz = Quiz.query.filter_by(id=args['quiz_id']).first()
        if not quiz:
            return{
                "message": "quiz with this id not exists"
                },404
        
        if args['correct_option'] < 1 or args['correct_option'] > 4:
            return{
                "message":"Correct option must be between 1 and 4"
            },400
        try:
            question = Question(
            quiz_id=args['quiz_id'],
            question_text=args['question_text'],
            option1=args['option1'],
            option2=args['option2'],
            option3=args['option3'],
            option4=args['option4'],
            correct_option=args['correct_option'])
            db.session.add(question)
            db.session.commit()
            return {
                            "message": "question added successfully!"
                        }
        except:
            return {
                "message": "One or more required fields are missing"
            }, 400
    
    @auth_required('token')
    @roles_required('admin')
    def put(self, question_id):
        question = Question.query.get_or_404(question_id)
        parser = reqparse.RequestParser()
        parser.add_argument('quiz_id')
        parser.add_argument('question_text')
        parser.add_argument('option1')
        parser.add_argument('option2')
        parser.add_argument('option3')
        parser.add_argument('option4')
        parser.add_argument('correct_option', type=int, required=True, help='Correct option is required (1-4)')
        args = parser.parse_args()
        
        # Check if quiz exists
        # quiz = Quiz.query.get_or_404(args['quiz_id'])
        
        if args['correct_option'] < 1 or args['correct_option'] > 4:
            return{
                "message":"Correct option must be between 1 and 4"
            },400
        
        quiz = Quiz.query.filter_by(id=args['quiz_id']).first()
        if not quiz:
            return{
                "message": "quiz with this id not exists"
                },404
        
        question.quiz_id = args['quiz_id']
        question.question_text = args['question_text']
        question.option1 = args['option1']
        question.option2 = args['option2']
        question.option3 = args['option3']
        question.option4 = args['option4']
        question.correct_option = args['correct_option']
        db.session.commit()
        return {
            "message":"question updated successfully!"
        }
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, question_id):
        question = Question.query.get(question_id)
        if question:
            db.session.delete(question)
            db.session.commit()
            return {'message': 'Question deleted successfully'}, 200
        else:
            return{
                "message":"question not found"
            }


class scoreApi(Resource):
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self):
        scores = []
        score_jsons =[]

        if current_user.has_role('admin'):
            scores = Score.query.all()
        else:
            scores = Score.query.filter_by(user_id = current_user.id).all()

        for score in scores:
            this_score = {}
            this_score["id"] = score.id
            this_score["user_id"] = score.user.id
            this_score["quiz_id"] = score.quiz.id
            this_score["score"] = score.score
            this_score["attempt_date"] = score.attempt_date
            score_jsons.append(this_score)

        if score_jsons:
            return score_jsons
        
        return{
            "message": "No score found"
        },404
    

class userApi(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        users = []
        user_jsons = []

        users = User.query.all()
        for user in users:
            this_user = {}
            this_user["id"] = user.id
            this_user["fullname"] = user.fullname
            this_user["email"] = user.email
            this_user["qualification"] = user.qualification
            this_user["dob"] = user.dob
            user_jsons.append(this_user)

        if user_jsons:
            return user_jsons
        
        return {
            "message": "No users found"
        }, 404
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            user_roles = [role.name for role in user.roles]
            if 'admin' in user_roles:
                return {
                    "message": "Cannot delete admin users"
                }, 403
            Score.query.filter_by(user_id=user_id).delete()
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted successfully'}, 200
        else:
            return{
                "message":"User not found"
            }

api.add_resource(subjectApi, '/apisubject/get', '/apisubject/create' ,'/apisubject/update/<int:subject_id>', '/apisubject/delete/<int:subject_id>')

api.add_resource(chapterApi, '/apichapter/get','/apichapter/create','/apichapter/update/<int:chapter_id>', '/apichapter/delete/<int:chapter_id>')

api.add_resource(quizApi, '/apiquiz/get','/apiquiz/create','/apiquiz/update/<int:quiz_id>','/apiquiz/delete/<int:quiz_id>')

api.add_resource(questionApi, '/apiquestion/get','/apiquestion/create','/apiquestion/update/<int:question_id>','/apiquestion/delete/<int:question_id>')

api.add_resource(scoreApi, '/apiscore/get')

api.add_resource(userApi, '/apiuser/get','/apiuser/delete/<int:user_id>')


            

        