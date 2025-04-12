# backend/tests/test_auth.py

from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)

prefix=settings.API_V1_STR

def test_register_user():
    response = client.post(f"{prefix}/auth/register", json={
        "email": "test@example.com",
        "password": "123456"
    })
    assert response.status_code == 201 or response.status_code == 400

def test_login_user():
    response = client.post(f"{prefix}/auth/login", data={
        "username": "test@example.com",
        "password": "123456"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
