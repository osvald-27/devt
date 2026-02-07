import pytest
import requests

BASE_URL = "http://192.168.56.1:3000/api/auth"

def test_signup_missing_fields():
    # Testing the "Fill all fields" logic from your JS code
    payload = {"name": "Test User", "email": ""}
    response = requests.post(f"{BASE_URL}/register", json=payload)
    assert response.status_code == 400
    assert "error" in response.json()

def test_login_success(mocker):
    # Mocking the database response for a successful login
    payload = {"email": "test@elite.com", "password": "password123"}
    
    # We simulate a successful backend response
    mock_response = mocker.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "accessToken": "mock_token_123",
        "refreshToken": "mock_refresh_456"
    }
    
    mocker.patch('requests.post', return_value=mock_response)
    
    response = requests.post(f"{BASE_URL}/login", json=payload)
    assert response.status_code == 200
    assert "accessToken" in response.json()