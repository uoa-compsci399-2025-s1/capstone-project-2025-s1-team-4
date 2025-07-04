from flask import Flask, Blueprint, request, jsonify, abort, make_response
import IMedicineRepo as repo
from db_con import get_repo

blueprint = Blueprint('routes_bp', __name__, url_prefix='/')

# Landing page indicates whether server is running or not
@blueprint.route("/")
def home():
    return make_response("<h3>Server is running.</h3>", 200)

'''
API to receive all medicines in the database
'''
@blueprint.route('/all_medicines', methods=['GET'])
def all_medicines():
    repo = get_repo()
    medicines = repo.get_medicines()
    
    
    return jsonify(medicines)


''' API to recieve medicine from barcode - BarcodeToMedicine
    input arguments: barcode
'''
@blueprint.route('/medicine', methods=['GET'])
def get_medicine_from_barcode():
    repo = get_repo()
    barcode = request.args.get('barcode')

    if not barcode:
        return jsonify({'error': 'Missing barcode parameter'}), 400

    medicine = repo.get_medicine_by_barcode(barcode)

    if medicine is None:
        return jsonify({
            'found': False,
            'message': f'Medicine with barcode {barcode} not found.',
            'medicine': None
        }), 200

    return jsonify({
        'found': True,
        'medicine': medicine
    }), 200


'''API to retrieve medicine information (JSON) - GetMedicine
    input arguments: Medicine
'''
@blueprint.route('/<int:medicine_id>/medicine', methods=['GET'])
def get_medicine_from_id(medicine_id):
    repo = get_repo()

    medicine = repo.get_medicine_by_id(medicine_id)

    if medicine is None:
        abort(404, description=f"Medicine with ID {medicine_id} not found.")


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
    if not results:
        return jsonify({"found": False, "medicines": [], "message": "No medicines found with that name."}), 200
    
    return jsonify(results)


'''API to return medicines cmi sheet'''
@blueprint.route('/medicine/cmi_sheet', methods=['GET'])
def get_cmi_sheet():
    repo = get_repo()
    medicine_id = request.args.get('id')
    barcode = request.args.get('barcode')

    if not medicine_id and not barcode:
        return jsonify({'error': 'Provide either medicine_id or barcode'}), 400
    
    if medicine_id:
        data = repo.get_cmi_sheet_by_medicine_id(int(medicine_id))
    else:
        data = repo.get_cmi_sheet_by_barcode(barcode)

    if not data:
        return jsonify({'error': 'CMI Sheet not found'}), 400
    
    return jsonify({'cmi_sheet': data})

'''API to return all recalled medicines in the database'''
@blueprint.route('/recalls', methods=['GET'])
def recalls():
    repo = get_repo()
    recalls = repo.get_recalls()
    return jsonify(recalls)

'''API to update database with new recalled medicine'''    
@blueprint.route('/recalls/update', methods=['GET','POST'])
def update_recalls_DB():
    repo = get_repo()
    try:
        updated = repo.update_recalls()
        if updated:
            return jsonify({'status': 'success', 'message': 'Database updated with new recall entries.'}), 200
        else:
            return jsonify({'status': 'no_change', 'message': 'No new recalls found to update.'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
