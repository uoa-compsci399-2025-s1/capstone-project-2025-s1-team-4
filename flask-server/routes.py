from flask import Flask, Blueprint, request, jsonify

blueprint = Blueprint('routes_bp', __name__, url_prefix='/')

@blueprint.route('/all_medicines', methods=['GET'])
def all_medicines():
    # Call all_medicines repo method here
    return {"Medicines": ["m11", "m2", "m3"]}


''' API to recieve medicine from barcode - BarcodeToMedicine
    input arguments: barcode
'''
@blueprint.route('/medicine', methods=['GET'])
def get_medicine_from_barcode():
    # Call method from barcode to medicine here
    pass


'''API to retrieve medicine information (JSON) - GetMedicine
    input arguments: Medicine
'''
@blueprint.route('/<int:medicine_id>/medicine_information', methods=['GET'])
def get_medicine_information():
    # Call repo method to retrieve a certain medicines information
    pass


'''API to search by name and return results - SearchMedicine
    input arguments: String
'''
@blueprint.route('/searchresults', methods=['GET'])
def search_medicine():
    searched = request.args.get('name')

    if not 'name': # I think this should be 'name' rather than a variable? Or possibly searched?
        return jsonify({'error': 'Missing name parameter'}), 400
    
    # pass searched into search functin from repo here

    pass