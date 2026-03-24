from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models, schemas, security, deps

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=schemas.UserResponse)
def register(user_in: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_data = user_in.model_dump()
    roles = user_data.pop("roles")
    password = user_data.pop("password")

    if not roles or not isinstance(roles, list):
        raise HTTPException(status_code=400, detail="roles must be a non-empty list")

    # argon2 handles passwords of any practical length, no 72-byte truncation issue.
    db_user = models.User(**user_data)
    db_user.roles = roles
    db_user.hashed_password = security.get_password_hash(password)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(login_req: LoginRequest, db: Session = Depends(deps.get_db)):
    user = db.query(models.User).filter(models.User.email == login_req.email).first()
    if not user or not security.verify_password(login_req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = security.create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "roles": user.roles,
            "reputation_score": getattr(user, "beneficiary_rating", 0.0)
        }
    }
