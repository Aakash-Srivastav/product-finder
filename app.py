# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from transformer_map import prod_map
# from serp import search_home_depot
# import os

# app = Flask(__name__)
# CORS(app)

# data_file_name = '/app/data/data.xlsx'

# def process(user_input):
#     try:
#         # product_result = gemini_rag(query=user_input)  # Get product result
#         product_id = prod_map(query=user_input,file_name=data_file_name)  # Map product
#         product_info = search_home_depot(query=product_id)  # Get final product details
#         return {"response": f"{product_info[0]}\n{product_info[1]}"}
#     except Exception as e:
#         return {"error": str(e)}

# @app.route('/find_product', methods=['POST'])
# def handle_text_input():
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400
    
#     data = request.get_json()
#     input_text = data.get('text')
#     if not input_text:
#         return jsonify({"error": "No text provided"}), 400
    
#     return jsonify(process(input_text)), 200

# if __name__ == '__main__':
#     app.run(debug=True, host="0.0.0.0", port=5000)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transformer_map import prod_map
from serp import search_home_depot
import os

app = Flask(__name__, static_folder="frontend/build", static_url_path="/")
CORS(app)

data_file_name = '/app/data/data.xlsx'

def process(user_input):
    try:
        # product_result = gemini_rag(query=user_input)  # Get product result
        product_id = prod_map(query=user_input,file_name=data_file_name)  # Map product
        product_info = search_home_depot(query=product_id)  # Get final product details
        return {"response": f"{product_info[0]}\n{product_info[1]}"}
    except Exception as e:
        return {"error": str(e)}

@app.route("/find_product", methods=["POST"])
def handle_text_input():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    input_text = data.get("text")
    if not input_text:
        return jsonify({"error": "No text provided"}), 400

    return jsonify(process(input_text)), 200

# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
