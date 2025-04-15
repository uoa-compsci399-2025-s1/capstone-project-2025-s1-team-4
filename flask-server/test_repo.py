import sqlite3
from MedicineRepo import MedicineRepo

connection=sqlite3.connect('medicine.db')
cursor=connection.cursor()
connection.execute("PRAGMA foreign_keys = ON") # enables foreign keys
connection.commit()

repo = MedicineRepo(cursor)

print("=== Get all medicines ===")
for med in repo.get_medicines():
    print(med)

connection.close()