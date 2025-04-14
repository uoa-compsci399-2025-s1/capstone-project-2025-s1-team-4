import sqlite3

def create_tables(cursor):
    # Create medicine table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    barcode TEXT UNIQUE NOT NULL)""")

    # Create information table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS information (
    id INTEGER PRIMARY KEY,
    name TEXT,
    company TEXT,
    dosage TEXT,
    cmi_sheet INTEGER,
    FOREIGN KEY (id) REFERENCES medicine(id) ON DELETE CASCADE)""")

    # Create CMI sheet table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cmi_sheet(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link TEXT,
    what TEXT
    before TEXT
    how TEXT
    while TEXT
    overdose TEXT
    side_effects TEXT
    after_using TEXT
    product_description TEXT
    supplier_details TEXT
    date_of_prep TEXT
    data_sheet TEXT)""")