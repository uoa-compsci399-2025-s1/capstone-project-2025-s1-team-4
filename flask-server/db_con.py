from flask import g
import sqlite3
from MedicineRepo import MedicineRepo

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect("medicine.db")
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db

def get_repo():
    if 'repo' not in g:
        g.repo = MedicineRepo(get_db())
    return g.repo