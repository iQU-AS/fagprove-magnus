# Step 1: Build React frontend
FROM node:20 AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ . 
RUN npm run build


# Step 2: Set up Django backend (final image)
FROM python:3.11 AS backend
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY backend/grocery_app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app/backend

# Copy built frontend into Django's static files directory (adjust path if needed)
COPY --from=frontend-builder /app/frontend/dist/assets /app/backend/grocery_app/static/assets/
COPY --from=frontend-builder /app/frontend/dist/index.html /app/backend/grocery_app/templates/index.html

WORKDIR /app/backend/grocery_app
RUN mkdir -p /app/backend/grocery_app/db

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

