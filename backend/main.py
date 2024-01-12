import json
import os

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import clusteringAnalyzer

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

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


@cross_origin(origin='http://localhost:3000', headers=['Content-Type', 'Authorization'])
@app.route('/upload', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Nome de arquivo vazio'})

    if file and file.filename.endswith('.csv'):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        # Instanciando e utilizando a classe ClusteringAnalyzer
        cluster_analysis = clusteringAnalyzer.ClusterAnalysis(file_path)
        cluster_analysis.gerar_graficos_e_descricoes()
        

        return jsonify({'message': 'Arquivo processado com sucesso'})

    return jsonify({'error': 'Formato de arquivo inválido'})


@app.route('/get-image/<image_name>', methods=['GET'])
def get_image(image_name):
    try:
        return send_file(f'images/{image_name}')
    except Exception as e:
        return str(e), 404


# Rota para retornar todas as imagens da pasta
@app.route('/get-all-images', methods=['GET'])
def get_all_images():
    try:
        image_names = [f for f in os.listdir(app.config['IMAGE_FOLDER']) if os.path.isfile(os.path.join(app.config['IMAGE_FOLDER'], f))]
        image_names = [f for f in image_names if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]

        sort = sorted(image_names)

        return jsonify({'images': sort})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/get-all-descriptions')
def get_all_descriptions():
    desc_folder = 'desc'
    descricoes = []

    for filename in sorted(os.listdir(desc_folder)):
        if filename.endswith(".json"):
            with open(os.path.join(desc_folder, filename), 'r') as json_file:
                descricao = json.load(json_file)
                descricoes.append(descricao)

    return jsonify({"descriptions": descricoes})


app.run(debug=True)
