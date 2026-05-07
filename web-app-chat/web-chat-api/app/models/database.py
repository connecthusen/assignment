from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Conversation(db.Model):
    __tablename__="conversation"

    id=db.Column(db.String(50), primary_key=True)
    title=db.Column(db.String(200))
    created_at=db.Column(db.DateTime,default=datetime.utcnow,index=True)
    updated_at=db.Column(db.DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)

    messages=db.relationship('Message',backref='conversation',lazy='dynamic',cascade='all,delete-orphan')

    def __repr__(self):
        return f'conversation: {self.id}'

    def to_dict(self):
        return{
            'id':self.id,
            'title':self.title,
            'messages': self.messages.count(),
            'created_at':self.created_at.isoformat() if self.created_at else None,
            'updated_at':self.updated_at.isoformat() if self.updated_at else None,
        }
class Message(db.Model):
    __tablename__="message"
    id=db.Column(db.String(50), primary_key=True)
    conversation_id=db.Column(db.String(50),db.ForeignKey('conversation.id'),nullable=False,index=True)
    role=db.Column(db.String(50),nullable=False)
    content=db.Column(db.Text,nullable=False)
    model=db.Column(db.String(50),nullable=False)
    timestamp=db.Column(db.DateTime,default=datetime.utcnow,index=True)

    def __repr__(self):
        return f'meassage: {self.id} - {self.role}'

    def to_dict(self):
        return{
            'id':self.id,
            'role':self.role,
            'content':self.content,
            'model':self.model,
            'timestamp':self.timestamp.isoformat() if self.timestamp else None,

        }