from sqlalchemy import Column, String, DateTime, ForeignKey, Table, ARRAY
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

# Association table for many-to-many relationship between users and whiteboards
whiteboard_users = Table(
    'whiteboard_users',
    Base.metadata,
    Column('user_id', String, ForeignKey('users.username')),
    Column('whiteboard_id', String, ForeignKey('whiteboards.id'))
)

class User(Base):
    __tablename__ = 'users'

    username = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    active_whiteboard = Column(String, ForeignKey('whiteboards.id'), nullable=True)
    
    # Relationships
    whiteboards = relationship(
        "Whiteboard",
        secondary=whiteboard_users,
        back_populates="connected_users"
    )

class Whiteboard(Base):
    __tablename__ = 'whiteboards'

    id = Column(String, primary_key=True, index=True)
    creator = Column(String, ForeignKey('users.username'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    connected_users = relationship(
        "User",
        secondary=whiteboard_users,
        back_populates="whiteboards"
    )
