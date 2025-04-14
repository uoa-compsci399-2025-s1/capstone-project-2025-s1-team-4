from flask import Flask, Blueprint

blueprint = Blueprint('routes_bp', __name__, url_prefix='/medicine')

@blueprint.route('/all')
def all_medicines():
    return {"Medicines": ["m11", "m2", "m3"]}


''' API to recieve medicine from barcode - BarcodeToMedicine
    input arguments: barcode
'''


'''API to retrieve medicine information (JSON) - GetMedicine
    input arguments: Medicine
'''



'''API to search by name and return results - SearchMedicine
    input arguments: String
'''