from flask import g
import psycopg2
from MedicineRepo import MedicineRepo
from dotenv import load_dotenv
import os
from urllib.parse import urlparse

load_dotenv() # Get environment variables from .env

def get_db():
    if 'db' not in g:
        DATABASE_URL = os.getenv("DATABASE_URL")
        # Parse the database URL
        result = urlparse(DATABASE_URL)

        g.db = psycopg2.connect(
            dbname=result.path[1:],  # remove leading /
            user=result.username,
            password=result.password,
            host=result.hostname,
            port=result.port or 5432,
            sslmode='require'  # add SSL mode here explicitly
        )
    return g.db

def get_repo():
    if 'repo' not in g:
        g.repo = MedicineRepo(get_db())
    return g.repo


# To use the sqlite database:

# def get_db():
#     if 'db' not in g:
#         g.db = sqlite3.connect("medicine.db")
#         g.db.execute("PRAGMA foreign_keys = ON")
#     return g.db

# def get_repo():
#     if 'repo' not in g:
#         g.repo = MedicineRepo(get_db())
#     return g.repo