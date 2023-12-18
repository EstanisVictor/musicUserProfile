import os

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

current_dir = os.path.dirname(os.path.abspath(__file__))
IMAGE_FOLDER = os.path.join(current_dir, 'images')
if not os.path.exists(IMAGE_FOLDER):
    os.makedirs(IMAGE_FOLDER)

app.config['IMAGE_FOLDER'] = IMAGE_FOLDER
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Nome de arquivo vazio'})

    if file:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        return jsonify({'message': 'Arquivo enviado com sucesso'})

    return jsonify({'error': 'Erro ao processar o arquivo'})


@app.route('/get-image/<image_name>', methods=['GET'])
def get_image(image_name):
    try:
        return send_file(f'images\\{image_name}')
    except Exception as e:
        return str(e), 404


# Rota para retornar todas as imagens da pasta
@app.route('/get-all-images', methods=['GET'])
def get_all_images():
    try:
        image_names = [f for f in os.listdir(app.config['IMAGE_FOLDER']) if os.path.isfile(os.path.join(app.config['IMAGE_FOLDER'], f))]
        image_names = [f for f in image_names if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]

        return jsonify({'images': image_names})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


app.run(debug=True)
