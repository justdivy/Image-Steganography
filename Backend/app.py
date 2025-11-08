import os 
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from stego import encode_image, decode_image

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

ALLOWED_EXT = {'png', 'bmp'} #PNG recommended(lossless)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT

@app.route('/encode', methods = ['POST'])
def encode():
    if 'image' not in request.files or 'message' not in request.form:
        return jsonify({'error': 'image and message required'}), 400
    
    file = request.files['image']
    message = request.form['message']

    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "no file or unsupported format (use PNG/BMP)"}), 400
    
    fname = secure_filename(file.filename)
    in_path = os.path.join(app.config['UPLOAD_FOLDER'], "in_" +fname)
    out_path = os.path.join(app.config['UPLOAD_FOLDER'], "stego_" +fname)
    file.save(in_path)

    try:
        encode_image(in_path, out_path, message)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return send_file(out_path, mimetype='image/png', as_attachment=True, download_name="stego.png")

@app.route('/decode', methods=['POST'])
def decode():
    if 'image' not in request.files:
        return jsonify({"error": "image required"}), 400
    file = request.files['image']
    fname = secure_filename(file.filename)
    in_path = os.path.join(app.config['UPLOAD_FOLDER'], "in_" + fname)
    file.save(in_path)
    try:
        message = decode_image(in_path)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"message": message})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
