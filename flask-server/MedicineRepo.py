from IMedicineRepo import AbstractRepository
from collections import defaultdict
from get_recalls import get_recalls, format_recalls

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


class MedicineRepo(AbstractRepository):
    def __init__(self, connection):
        self.connection = connection
        self.cursor = connection.cursor()

    def get_medicines(self):
        self.cursor.execute("""
            SELECT 
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
        """)
        rows = self.cursor.fetchall()
        return group_medicines_with_ingredients(rows)

    def get_medicine_by_id(self, id):
        self.cursor.execute("""
            SELECT 
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
            WHERE m.id = %s
        """, (id,))
        rows = self.cursor.fetchall()
        return None if not rows else group_medicines_with_ingredients(rows)

    def get_medicine_by_barcode(self, barcode):
        self.cursor.execute("""
            SELECT 
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
            WHERE m.barcode = %s
        """, (barcode,))
        rows = self.cursor.fetchall()
        return None if not rows else group_medicines_with_ingredients(rows)

    def search_medicine_by_name(self, string):
        self.cursor.execute("""
            SELECT 
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
            WHERE m.product_name ILIKE %s
            ORDER BY m.product_name ASC
        """, (f"%{string}%",))
        rows = self.cursor.fetchall()
        return None if not rows else group_medicines_with_ingredients(rows)

    def get_cmi_sheet_by_medicine_id(self, id):
        self.cursor.execute("""
            SELECT c.* 
            FROM cmi_sheet c 
            JOIN medicine m ON m.cmi_sheet = c.id 
            WHERE m.id = %s
        """, (id,))
        return self.cursor.fetchone()

    def get_cmi_sheet_by_barcode(self, barcode):
        self.cursor.execute("""
            SELECT c.* 
            FROM cmi_sheet c 
            JOIN medicine m ON m.cmi_sheet = c.id 
            WHERE m.barcode = %s
        """, (barcode,))
        return self.cursor.fetchone()

    def get_ingredients_by_medicine_id(self, medicine_id):
        self.cursor.execute("""
            SELECT i.name, mi.dosage
            FROM ingredients i
            JOIN medicine_ingredients mi ON i.id = mi.ingredient_id
            WHERE mi.medicine_id = %s
        """, (medicine_id,))
        return self.cursor.fetchall()

    def get_recalls(self):
        self.cursor.execute("""
            SELECT 
                r.id,
                r.date,
                r.recall_url,
                r.brand_name,
                r.recall_action
            FROM recalls r
        """)
        rows = self.cursor.fetchall()
        headers = ["id", "date", "recall_url", "brand_name", "recall_action"]
        return [dict(zip(headers, row)) for row in rows]

    def update_recalls(self):
        raw_data = get_recalls()
        if not raw_data:
            return None
        formatted = format_recalls(raw_data)
        inserted_count = 0

        for row in formatted:
            self.cursor.execute("""
                INSERT INTO recalls (date, recall_url, brand_name, recall_action)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (recall_url) DO NOTHING
            """, row)

            if self.cursor.rowcount > 0:
                inserted_count += 1

        self.connection.commit()
        return inserted_count > 0
