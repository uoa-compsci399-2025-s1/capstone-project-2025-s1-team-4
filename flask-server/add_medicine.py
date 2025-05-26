import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # flask-server/
db_path = os.path.join(BASE_DIR, "medicine.db")

def check_tables():
    with sqlite3.connect(db_path) as con:
        cur = con.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cur.fetchall()
        print(tables)

def add_medicine(name, company, dosage, cmi, barcode):
    data = [None, name, company, dosage, cmi, str(barcode)]
    with sqlite3.connect(db_path) as con:
        cur = con.cursor()
        cur.execute("INSERT INTO medicine VALUES(?, ?, ?, ?, ?, ?)", data)
