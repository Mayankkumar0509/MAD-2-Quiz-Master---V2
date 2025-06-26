from flask import Flask
from application.database import db
from application.models import User,Role

from application.config import LocalDevelopmentConfig
from flask_security import Security , SQLAlchemyUserDatastore
from werkzeug.security import generate_password_hash
import uuid
from application.celery_init import celery_init_app
from celery.schedules import crontab      #crontab is scheduller of celery that provides custom schedules
from flask_caching import Cache

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)

    # app.config['CACHE_TYPE'] = 'RedisCache'
    # app.config['CACHE_DEFAULT_TIMEOUT'] = 300
    # app.config['CACHE_REDIS_URL'] = 'redis://localhost:6379/2'

    db.init_app(app)
    cache = Cache(app)
    

    # cache = Cache(app)

    app.cache = cache

    datastore = SQLAlchemyUserDatastore(db,User,Role)
    app.cache = cache
    app.security = Security(app, datastore)
    app.app_context().push()

    from application.resources import api
    api.init_app(app)

    return app

app = create_app()
celery = celery_init_app(app)
celery.autodiscover_tasks()

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name = "admin", description = "superuser")
    app.security.datastore.find_or_create_role(name = "user", description = "general_user")
    db.session.commit()

    if not app.security.datastore.find_user(email = "user0@admin.com"):
        app.security.datastore.create_user(email = "user0@admin.com",fullname ="admin01",qualification = "degree",dob = "05-09-2003",password = generate_password_hash("1234"),roles = ['admin'])
        
    if not app.security.datastore.find_user(email = "user1@user.com"):
        app.security.datastore.create_user(email = "user1@user.com",fullname ="user01",qualification = "diploma",dob = "05-09-2003",password = generate_password_hash("1234"),roles = ['user'])
    db.session.commit()

from application.routes import *

@celery.on_after_finalize.connect 
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute = '*/2'),   #*/2 means every 2 minutes for change in time go to celery crontab documentation
        monthly_report.s(),
    )


if __name__ == "__main__":
    app.run()