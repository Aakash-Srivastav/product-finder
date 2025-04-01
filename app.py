import numpy as np
import pickle
import pandas as pd
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app=Flask(__name__)
pickle_in = open("classifier.pkl","rb")
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)