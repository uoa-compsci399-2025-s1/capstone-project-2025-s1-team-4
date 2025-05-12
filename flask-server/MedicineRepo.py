# Implement data repository (database)
# Each function should take in as parameter (cursor) where we execute SQL commands

from IMedicineRepo import AbstractRepository
from collections import defaultdict

# Recalls
from get_recalls import get_recalls, format_recalls

"""Helper functions"""
def group_medicines_with_ingredients(rows):
    grouped = {}

    for each_row in rows:
        medicine_id = each_row[0]
        product_name = each_row[1]
        company = each_row[2]
        cmi_sheet = each_row[3]
        barcode = each_row[4]
        ingredient = each_row[5]
        dosage = each_row[6]
        if medicine_id not in grouped:
            grouped[medicine_id] = {
                "id": medicine_id,
                "product_name": product_name,
                "company": company,
                "cmi_sheet": cmi_sheet,
                "barcode": barcode,
                "ingredients": []
            }

        grouped[medicine_id]["ingredients"].append({
            "ingredient": ingredient,
            "dosage": dosage
        })

    return list(grouped.values())


"""Repository"""
class MedicineRepo(AbstractRepository):
    def __init__(self, connection):
        self.connection = connection
        self.cursor = connection.cursor()

    # Get all medicines alphabetically for the browsing pages 
    # return = medicine_id, product_name, company, cmi_sheet, barcode, 
    def get_medicines(self):
        self.cursor.execute("""SELECT 
            m.id,
            m.product_name,
            m.company,
            m.cmi_sheet,
            m.barcode,
            i.name,
            mi.dosage
            FROM medicine m
            JOIN medicine_ingredients mi ON m.id = mi.medicine_id
            JOIN ingredients i ON i.id = mi.ingredient_id""")
        rows = self.cursor.fetchall()
        return group_medicines_with_ingredients(rows)

    # When someone clicks on a medicine and visits the detail page 
    def get_medicine_by_id(self, id):
        self.cursor.execute("""SELECT 
            m.id,
            m.product_name,
            m.company,
            m.cmi_sheet,
            m.barcode,
            i.name,
            mi.dosage
            FROM medicine m
            JOIN medicine_ingredients mi ON m.id = mi.medicine_id
            JOIN ingredients i ON i.id = mi.ingredient_id 
            WHERE m.id = ?""", (id,))
        rows = self.cursor.fetchall()

        if not rows:
            return None
        return group_medicines_with_ingredients(rows)

    # Used when someone scans a barcode 
    def get_medicine_by_barcode(self, barcode): 
        self.cursor.execute("""SELECT 
            m.id,
            m.product_name,
            m.company,
            m.cmi_sheet,
            m.barcode,
            i.name,
            mi.dosage
            FROM medicine m
            JOIN medicine_ingredients mi ON m.id = mi.medicine_id
            JOIN ingredients i ON i.id = mi.ingredient_id 
            WHERE m.barcode = ?""", (barcode,))
        rows = self.cursor.fetchall()
        if not rows:
            return None
        return group_medicines_with_ingredients(rows)

    # Used when someone like searching for a medicine 
    def search_medicine_by_name(self, string):
        self.cursor.execute("""SELECT 
            m.id,
            m.product_name,
            m.company,
            m.cmi_sheet,
            m.barcode,
            i.name,
            mi.dosage
            FROM medicine m
            JOIN medicine_ingredients mi ON m.id = mi.medicine_id
            JOIN ingredients i ON i.id = mi.ingredient_id  WHERE m.product_name LIKE ? ORDER BY product_name ASC""", (f"%{string}%",))
        rows = self.cursor.fetchall()
        if not rows:
            return None
        return group_medicines_with_ingredients(rows)

    def get_cmi_sheet_by_medicine_id(self, id):
        self.cursor.execute("""
        SELECT c.* 
        FROM cmi_sheet c 
        JOIN medicine m ON m.cmi_sheet = c.id 
        WHERE m.id = ?
        """, (id,))
        return self.cursor.fetchone()
    
    def get_cmi_sheet_by_barcode(self, barcode):
        self.cursor.execute("""
        SELECT c.* 
        FROM cmi_sheet c 
        JOIN medicine m ON m.cmi_sheet = c.id 
        WHERE m.barcode = ?
        """, (barcode,))
        return self.cursor.fetchone()


    def get_ingredients_by_medicine_id(self, medicine_id):
        self.cursor.execute("""
        SELECT i.name, mi.dosage
        FROM ingredients i
        JOIN medicine_ingredients mi ON i.id = mi.ingredient_id
        WHERE mi.medicine_id = ?
        """, (medicine_id,))
        return self.cursor.fetchall()
    
    # Returns recall information in as a list of dictionaries
    def get_recalls(self):
        raw_data = get_recalls()
        if not raw_data:
            return None
        formatted = format_recalls(raw_data)
        headers = ["date", "recall_url", "brand_name", "recall_action"]
        return [dict(zip(headers, row)) for row in formatted]

