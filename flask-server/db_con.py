from flask import g
import psycopg2
from MedicineRepo import MedicineRepo
from dotenv import load_dotenv
import os

load_dotenv() # Get environment variables from .env

def get_db():
    if 'db' not in g:
        DATABASE_URL = os.getenv("DATABASE_URL")
        g.db = psycopg2.connect(DATABASE_URL)
    return g.db

def get_repo():
    if 'repo' not in g:
        g.repo = MedicineRepo(get_db())
    return g.repo
