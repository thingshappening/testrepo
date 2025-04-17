from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from database.connection import get_db
from database.models import User, Whiteboard, Base
from database.connection import engine

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/users")
async def create_user(username: str, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == username).first()
    if db_user:
        return {"username": username}
    
    new_user = User(username=username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"username": username}

@app.get("/api/users/{username}")
async def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/whiteboards")
async def create_whiteboard(creator: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == creator).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    whiteboard_id = str(uuid.uuid4())
    new_whiteboard = Whiteboard(
        id=whiteboard_id,
        creator=creator
    )
    
    # Add the creator to connected users
    new_whiteboard.connected_users.append(user)
    
    # Update user's active whiteboard
    user.active_whiteboard = whiteboard_id
    
    db.add(new_whiteboard)
    db.commit()
    db.refresh(new_whiteboard)
    
    print(f"\nNew whiteboard created:")
    print(f"ID: {whiteboard_id}")
    print(f"Creator: {creator}")
    print(f"Connected users: {[user.username for user in new_whiteboard.connected_users]}")
    
    return {"whiteboard_id": whiteboard_id}

@app.get("/api/whiteboards/{whiteboard_id}")
async def get_whiteboard(whiteboard_id: str, db: Session = Depends(get_db)):
    whiteboard = db.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
    if not whiteboard:
        raise HTTPException(status_code=404, detail="Whiteboard not found")
    
    return {
        "id": whiteboard.id,
        "creator": whiteboard.creator,
        "created_at": whiteboard.created_at,
        "connected_users": [user.username for user in whiteboard.connected_users]
    }

@app.post("/api/whiteboards/{whiteboard_id}/join")
async def join_whiteboard(whiteboard_id: str, username: str, db: Session = Depends(get_db)):
    whiteboard = db.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
    if not whiteboard:
        raise HTTPException(status_code=404, detail="Whiteboard not found")
    
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user not in whiteboard.connected_users:
        whiteboard.connected_users.append(user)
        user.active_whiteboard = whiteboard_id
        db.commit()
        db.refresh(whiteboard)
    
    return {
        "id": whiteboard.id,
        "creator": whiteboard.creator,
        "created_at": whiteboard.created_at,
        "connected_users": [user.username for user in whiteboard.connected_users]
    }

@app.post("/api/whiteboards/{whiteboard_id}/leave")
async def leave_whiteboard(whiteboard_id: str, username: str, db: Session = Depends(get_db)):
    whiteboard = db.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
    if not whiteboard:
        raise HTTPException(status_code=404, detail="Whiteboard not found")
    
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user in whiteboard.connected_users:
        whiteboard.connected_users.remove(user)
        user.active_whiteboard = None
        db.commit()
        db.refresh(whiteboard)
    
    return {
        "id": whiteboard.id,
        "creator": whiteboard.creator,
        "created_at": whiteboard.created_at,
        "connected_users": [user.username for user in whiteboard.connected_users]
    }
