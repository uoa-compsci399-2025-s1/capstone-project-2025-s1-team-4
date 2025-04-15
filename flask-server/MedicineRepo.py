# Implement data repository (database)
# Each function should take in as parameter (cursor) where we execute SQL commands

from IMedicineRepo import AbstractRepository

class MedicineRepo(AbstractRepository):
    def __init__(self, cursor):
        self.cursor = cursor

    # Get all medicines alphabetically for the browsing pages 
    def get_medicines(self):
        self.cursor.execute("SELECT * FROM medicines ORDER BY name ASC")
        return self.cursor.fetchall()

    # When someone clicks on a medicine and visits the detail page 
    def get_medicine_by_id(self):
        self.cursor.execute("SELECT * FROM medicines WHERE id = ?", (id,))
        return self.cursor.fetchone()

    # Used when someone scans a barcode 
    def get_medicine_by_barcode(self, barcode): 
        self.cursor.execute("SELECT * FROM medicines WHERE barcode = ?", (barcode,))
        return self.cursor.fetchone()

    # Used when someone like searching for a medicine 
    def search_medicine_by_name(self, string):
        self.cursor.execute("SELECT * FROM medicines WHERE name LIKE ? ORDER BY name ASC", (f"%{string}%",))
        return self.cursor.fetchall()
