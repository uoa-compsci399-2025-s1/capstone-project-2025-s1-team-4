def serialize_medicine_row(row):
    return {
        'id': row[0],
        'name': row[1],
        'company': row[2],
        'cmi_sheet': row[3],
        'barcode': row[4]
    }