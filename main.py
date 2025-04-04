from flask import Flask, request, jsonify
from flask_cors import CORS
from transformer_map import prod_map
from serp import search_home_depot

def process(user_input):
    try:
        # product_result = gemini_rag(query=user_input)  # Get product result
        product_id = prod_map(query=user_input)  # Map product
        product_info = search_home_depot(query=product_id)  # Get final product details
        return {"response": f"{product_info[0]}\n{product_info[1]}"}
    except Exception as e:
        return {"error": str(e)}


