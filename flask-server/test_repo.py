import sqlite3
from MedicineRepo import MedicineRepo

connection=sqlite3.connect('medicine.db')
cursor=connection.cursor()
connection.execute("PRAGMA foreign_keys = ON") # enables foreign keys
connection.commit()

repo = MedicineRepo(connection)

# print("=== Get all medicines ===")
# print(repo.get_medicines())

# print("\n=== Get medicine by ID (1) ===")
# print(repo.get_medicine_by_id(3))

# print("\n=== Get medicine by barcode (e.g., '123456789') ===")
# print(repo.get_medicine_by_barcode("456"))

# print("\n=== Search medicine by name (e.g., 'para') ===")
# for med in repo.search_medicine_by_name("ibu"):
#     print(med)

# print("\n=== Get CMI by medicine id===")
# print(repo.get_cmi_sheet_by_medicine_id(1))

# print("\n=== Get medicine ingredients by medicine id===")
# for ingredients in repo.get_ingredients_by_medicine_id(3):
#     print(ingredients)

# print("\n=== Get recalls===")
# print(repo.get_recalls())

# print("\n=== Update recalls===")
# print(repo.update_recalls())

connection.close()


