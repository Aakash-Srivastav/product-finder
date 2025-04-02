import numpy as np
import pickle
import pandas as pd
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os

app=Flask(__name__)
pickle_in = open("model.pkl","rb")
output=pickle.load(pickle_in)

@app.route('/find_product', methods=['POST'])
def handle_text_input():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    input_text = data.get('text')
    if not input_text:
        return jsonify({"error": "No text provided"}), 400
    
    return jsonify(output(input_text)), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Use Render's PORT or default to 10000
    app.run(host="0.0.0.0", port=port)