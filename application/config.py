class config():
    DEBUG =False
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class LocalDevelopmentConfig(config):
    # configuration
    SQLALCHEMY_DATABASE_URI = "sqlite:///quizmaster.sqlite3"
    DEBUG = True

    # config for security
    SECRET_KEY = "this-is-a-secret-key"  # hash user cred in session
    SECURITY_PASSWORD_HASH = "bcrypt" #mechanism for hashing password
    SECURITY_PASSWORD_SALT = "this-is-a-password-salt" #helps in hashing password
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"

    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379


