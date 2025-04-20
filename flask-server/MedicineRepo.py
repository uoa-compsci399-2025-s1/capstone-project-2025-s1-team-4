# Implement data repository (database)
# Each function should take in as parameter (cursor) where we execute SQL commands

from IMedicineRepo import AbstractRepository

class MedicineRepo(AbstractRepository):
    def __init__(self, connection):
        self.connection = connection
        self.cursor = connection.cursor()

    # Get all medicines alphabetically for the browsing pages 
    def get_medicines(self):
        self.cursor.execute("SELECT * FROM medicine ORDER BY product_name ASC")
        return self.cursor.fetchall()

    # When someone clicks on a medicine and visits the detail page 
    def get_medicine_by_id(self, id):
        self.cursor.execute("SELECT * FROM medicine WHERE id = ?", (id,))
        return self.cursor.fetchone()

    # Used when someone scans a barcode 
    def get_medicine_by_barcode(self, barcode): 
        self.cursor.execute("SELECT * FROM medicine WHERE barcode = ?", (barcode,))
        return self.cursor.fetchone()

    # Used when someone like searching for a medicine 
    def search_medicine_by_name(self, string):
        self.cursor.execute("SELECT * FROM medicine WHERE product_name LIKE ? ORDER BY product_name ASC", (f"%{string}%",))
        return self.cursor.fetchall()

    def get_cmi_sheet_by_medicine_id(self, id):
        self.cursor.execute("""
        SELECT c.* 
        FROM cmi_sheet c 
        JOIN medicine m ON m.cmi_sheet = c.id 
        WHERE m.id = ?
        """, (id,))
        return self.cursor.fetchone()


    def get_ingredients_by_medicine_id(self, medicine_id):
        self.cursor.execute("""
        SELECT i.name, mi.dosage
        FROM ingredients i
        JOIN medicine_ingredients mi ON i.id = mi.ingredient_id
        WHERE mi.medicine_id = ?
        """, (medicine_id,))
        return self.cursor.fetchall()

