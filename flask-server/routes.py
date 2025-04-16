from flask import Flask, Blueprint, request, jsonify, abort, make_response
import IMedicineRepo as repo
from db_con import get_repo

blueprint = Blueprint('routes_bp', __name__, url_prefix='/')

# Home - Just for testing purposes will be removed once front end is done.
@blueprint.route("/")
def home():
    return make_response("<h3>Server is running.</h3>", 200)

'''
API to recieve all medicines in the database
'''
@blueprint.route('/all_medicines', methods=['GET'])
def all_medicines():
    repo = get_repo()
    raw_data = repo.get_medicines()
    
    medicines = [{'id': row[0], 'name': row[1], 'company': row[2], 'dosage': row[3], 
                  'cmi_sheet': row[4], 'barcode': row[5]} for row in raw_data]
    
    return jsonify(medicines)


''' API to recieve medicine from barcode - BarcodeToMedicine
    input arguments: barcode
'''
@blueprint.route('/medicine', methods=['GET'])
def get_medicine_from_barcode():
    repo = get_repo()
    barcode = request.args.get('barcode')

    if not barcode:
        return jsonify({'error': 'Missing name parameter'}), 400
    
    raw_data = repo.get_medicine_by_barcode(barcode)

    if raw_data is None:
        return jsonify({'error': f'Medicine with barcode {barcode} not found.'}), 404

    medicine = {'id': raw_data[0], 'name': raw_data[1], 'company': raw_data[2], 'dosage': raw_data[3], 
            'cmi_sheet': raw_data[4], 'barcode': raw_data[5]}
    return jsonify(medicine)


'''API to retrieve medicine information (JSON) - GetMedicine
    input arguments: Medicine
'''
@blueprint.route('/<int:medicine_id>/medicine', methods=['GET'])
def get_medicine_from_id(medicine_id):
    repo = get_repo()

    raw_data = repo.get_medicine_by_id(medicine_id)

    if raw_data is None:
        abort(404, description=f"Medicine with ID {medicine_id} not found.")

    medicine = {'id': raw_data[0], 'name': raw_data[1], 'company': raw_data[2], 'dosage': raw_data[3], 
            'cmi_sheet': raw_data[4], 'barcode': raw_data[5]}

    return jsonify(medicine)


'''API to search by name and return results - SearchMedicine
    input arguments: String
'''
@blueprint.route('/searchresults', methods=['GET'])
def search_medicine():
    repo = get_repo()
    searched = request.args.get('name')

    if not searched:
        return jsonify({'error': 'Missing name parameter'}), 400
    
    results = repo.search_medicine_by_name(searched)
    # If no results, then an empty list is returned
    if results == []:
        return make_response("<h3>No medicines found with that name.</h3>", 404)
    
    format_results = [{'id': row[0], 'name': row[1], 'company': row[2], 'dosage': row[3], 
                  'cmi_sheet': row[4], 'barcode': row[5]} for row in results]
    return jsonify(format_results)
