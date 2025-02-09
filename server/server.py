import uuid
import json
import os
from datetime import datetime
from datetime import timezone

# Library imports
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__,
    static_folder='../frontend/build',
    static_url_path='')
CORS(app)


FILE = 'data.json'

def checkfile():
    datafile = os.path.join(os.path.dirname(__file__), FILE)
    if not os.path.exists(datafile):
        with open(datafile, 'w') as file:
            json.dump([], file)

    with open(datafile) as file:
        content = file.read()

    if not content:
        with open(datafile, 'w') as file:
            json.dump([], file)

    return datafile


def addToFile(link):
    # Create emtpy file if os.path does not exist
    datafile = checkfile()

    # Prepend to json file
    datestr = datetime.now(timezone.utc).isoformat()

    obj = {
        'idx': uuid.uuid4().hex,
        'link': link,
        'date': datestr,
    }

    try:
        data = readfile()
        data.insert(0, obj)
        
        with open(datafile, 'w') as file:
            json.dump(data, file)

        return True
    except Exception as e:
        print(f'failed to add to file with e', e)
        return False

def readfile():
    datafile = checkfile()
    with open(datafile) as file:
        content = json.load(file)

    return content


# Serve React App
@app.route('/')
def serve():
    print(f'Serving static files from {app.static_folder}')
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/links', methods=['GET'])
def get_signin_url():
    '''
    Get all the last N links in the board.
    '''
    # Get request args
    offset = request.args.get('offset') or 0
    n = request.args.get('n') or 10

    # Read from the file
    data = readfile()

    payload = data[offset:offset+n]
    
    
    # Return payload
    return jsonify(payload), 200


@app.route('/add', methods=['POST'])
def login():
    '''
    POST a link to the board.
    Will add to a file.
    '''
    # Get request args
    link = request.json.get('link')

    if not link:
        return jsonify({'error': 'No link provided'}), 400

    # Try to add to the file
    try:
        success = addToFile(link)

        if not success:
            return jsonify({
                'success': False,
                'message': 'Server failed to post link',
            }), 500

        return jsonify({
            'success': True,
            'message': 'Added successully!',
        }), 200
    except Exception as e:
        import traceback
        print('Error posting link:', e)
        print('Full stack trace:')
        print(traceback.format_exc())
        payload = {
            'success': False,
            'message': 'Server failed to post link',
            'error': str(e),
        }
        return jsonify(payload), 500

if __name__ == '__main__':
    app.run(debug=True, port=3024)
