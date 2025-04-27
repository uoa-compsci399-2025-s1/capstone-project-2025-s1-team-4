import sqlite3

def create_tables(cursor):

    # Create CMI sheet table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cmi_sheet(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link TEXT,
    what TEXT,
    before TEXT,
    how TEXT,
    while TEXT,
    overdose TEXT,
    side_effects TEXT,
    after_using TEXT,
    product_description TEXT,
    supplier_details TEXT,
    date_of_prep TEXT,
    data_sheet TEXT)""")

    # Create medicine table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    company TEXT,
    cmi_sheet INTEGER,
    barcode TEXT UNIQUE,
    FOREIGN KEY (cmi_sheet) REFERENCES cmi_sheet(id))
    """)

    # Create ingredients table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ingredients(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ingredient TEXT
    )
    """)

    # Create medicine_ingredients table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicine_ingredients (
        medicine_id INTEGER,
        ingredient_id INTEGER,
        dosage TEXT,
        PRIMARY KEY (medicine_id, ingredient_id),
        FOREIGN KEY (medicine_id) REFERENCES medicine(id),
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    )""")