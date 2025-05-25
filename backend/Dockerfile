# FROM python:3.10

# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# CMD ["bash", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
# # CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000","--reload"]

# COPY wait-for-postgres.sh /wait-for-postgres.sh
# RUN chmod +x /wait-for-postgres.sh

FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["bash", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
