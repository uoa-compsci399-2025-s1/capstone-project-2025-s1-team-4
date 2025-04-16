import sqlite3
import os

def check_tables():
    with sqlite3.connect(r"C:\programming\MD\capstone-project-2025-s1-team-4\flask-server\medicine.db") as con:
        cur = con.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cur.fetchall()
        print(tables)

def add_medicine(name, company, dosage, cmi, barcode):
    data = [None, name, company, dosage, cmi, str(barcode)]
    with sqlite3.connect(r"C:\programming\MD\capstone-project-2025-s1-team-4\flask-server\medicine.db") as con:
        cur = con.cursor()
        cur.execute("INSERT INTO medicine VALUES(?, ?, ?, ?, ?, ?)", data)


print(os.path.abspath("medicine.db"))


#check_tables()

add_medicine('Histaclear', 'AFT Pharmaceuticals', '10 mg', 4, '9421033250285')