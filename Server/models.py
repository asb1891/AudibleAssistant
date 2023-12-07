from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy import MetaData 

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata= MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)

class Prompts(db.Model, SerializerMixin):
    __tablename__ = 'prompts'
    prompt_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    prompt_question = db.Column(db.String)

    @validates("prompt_question")
    def validate_prompt_question(self, key, prompt_question):
        if not prompt_question:
            raise ValueError("Prompt question cannot be empty")
        return prompt_question

class Responses(db.Model, SerializerMixin):
    __tablename__ ='responses'
    response_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    response_answer = db.Column(db.String)

# class Users(db.Model, SerializerMixin):
#     __tablename__ = 'users'
#     user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     user_name = db.Column(db.String, nullable=False)


