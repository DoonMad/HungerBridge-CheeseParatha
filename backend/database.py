import os 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if "sqlite" in DATABASE_URL:
    agrs = {"check_same_thread": False}
else:
    agrs = {}

engine = create_engine(DATABASE_URL, 
                       connect_args=agrs
                       )

SessionLocal = sessionmaker(autocommit=False,
                             autoflush=False, bind=engine)

Base = declarative_base()