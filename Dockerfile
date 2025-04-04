# # # FROM python:3.8
# # # COPY . /app
# # # WORKDIR /app
# # # RUN pip install -r requirements.txt
# # # CMD python app.py

# # # Step 1: Build the React frontend
# # # Step 1: Build React Frontend
# # FROM node:18 AS frontend
# # WORKDIR /app
# # COPY productfinder /app
# # RUN npm install && npm run build

# # # Step 2: Setup Flask Backend
# # FROM python:3.8 AS backend
# # WORKDIR /app
# # COPY --from=frontend /app/build /app/build
# # COPY . /app

# # # Copy Excel file into the container
# # COPY data/data.xlsx /app/data/data.xlsx

# # RUN pip install -r requirements.txt

# # CMD ["python", "app.py"]

# FROM node:18 AS frontend
# WORKDIR /app
# COPY client /app
# RUN npm install && npm run build

# # Step 2: Setup Flask Backend
# FROM python:3.8 AS backend
# WORKDIR /app
# COPY --from=frontend /app/build /app/build
# COPY . /app

# # Copy Excel file into the container
# COPY data/data.xlsx /app/data/data.xlsx

# RUN pip install -r requirements.txt

# # -------- NGINX SETUP --------
# RUN apt-get update && apt-get install -y nginx
# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# CMD service nginx start && gunicorn -b 0.0.0.0:5000 app:app

# Step 1: Build React app
FROM node:18 as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Build Flask backend
FROM python:3.9
WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy Flask app files
COPY app.py ./
COPY transformer_map.py ./
COPY serp.py ./
COPY data/ ./data/

# Copy built React app into Flask static folder
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Expose port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
