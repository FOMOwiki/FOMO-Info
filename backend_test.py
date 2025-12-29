#!/usr/bin/env python3
"""
Backend API Testing for FOMO Crypto Platform
Tests Cookie Consent API and Admin Authentication
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://blockchainapp-2.preview.emergentagent.com/api"
ADMIN_PASSWORD = "admin123"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_test_header(test_name):
    print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}Testing: {test_name}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.ENDC}")

def print_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

def test_cookie_consent_get():
    """Test GET /api/cookie-consent-settings"""
    print_test_header("Cookie Consent GET API")
    
    try:
        url = f"{BACKEND_URL}/cookie-consent-settings"
        print_info(f"Testing URL: {url}")
        
        response = requests.get(url, timeout=10)
        
        print_info(f"Response Status: {response.status_code}")
        print_info(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print_info(f"Response Data: {json.dumps(data, indent=2)}")
            
            # Validate required fields
            required_fields = ['id', 'enabled', 'privacy_policy_url', 'terms_url', 'cookie_policy_url', 'title_en', 'description_en']
            missing_fields = []
            
            for field in required_fields:
                if field not in data:
                    missing_fields.append(field)
            
            if missing_fields:
                print_error(f"Missing required fields: {missing_fields}")
                return False
            else:
                print_success("All required fields present in response")
                
            # Check for Russian language fields (should not be present)
            russian_fields = [key for key in data.keys() if key.endswith('_ru')]
            if russian_fields:
                print_warning(f"Found Russian language fields (should be removed): {russian_fields}")
            else:
                print_success("No Russian language fields found (as expected)")
                
            print_success("Cookie Consent GET API test passed")
            return True
        else:
            print_error(f"API returned status code {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except json.JSONDecodeError as e:
        print_error(f"Invalid JSON response: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        return False

def test_admin_login():
    """Test POST /api/admin/login"""
    print_test_header("Admin Login API")
    
    try:
        url = f"{BACKEND_URL}/admin/login"
        print_info(f"Testing URL: {url}")
        
        payload = {"password": ADMIN_PASSWORD}
        print_info(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, timeout=10)
        
        print_info(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_info(f"Response Data: {json.dumps(data, indent=2)}")
            
            # Validate response structure
            required_fields = ['success', 'token', 'message']
            missing_fields = []
            
            for field in required_fields:
                if field not in data:
                    missing_fields.append(field)
            
            if missing_fields:
                print_error(f"Missing required fields: {missing_fields}")
                return False, None
            
            if data.get('success') != True:
                print_error("Login success field is not True")
                return False, None
                
            token = data.get('token')
            if not token or len(token) < 20:
                print_error("Invalid or missing token")
                return False, None
                
            print_success("Admin login successful")
            print_success(f"Received valid token: {token[:20]}...")
            return True, token
        else:
            print_error(f"API returned status code {response.status_code}")
            print_error(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False, None
    except json.JSONDecodeError as e:
        print_error(f"Invalid JSON response: {str(e)}")
        return False, None
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        return False, None

def test_admin_login_invalid_password():
    """Test admin login with invalid password"""
    print_test_header("Admin Login API - Invalid Password")
    
    try:
        url = f"{BACKEND_URL}/admin/login"
        payload = {"password": "wrongpassword"}
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 401:
            print_success("Correctly rejected invalid password with 401 status")
            return True
        else:
            print_error(f"Expected 401 status for invalid password, got {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        return False

def test_cookie_consent_update(admin_token):
    """Test PUT /api/admin/cookie-consent-settings"""
    print_test_header("Cookie Consent Admin Update API")
    
    if not admin_token:
        print_error("No admin token available for testing")
        return False
    
    try:
        url = f"{BACKEND_URL}/admin/cookie-consent-settings"
        print_info(f"Testing URL: {url}")
        
        # Test data to update
        update_data = {
            "title_en": "Updated Cookie & Privacy Settings",
            "description_en": "Updated description for cookie consent",
            "enabled": True
        }
        
        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Content-Type": "application/json"
        }
        
        print_info(f"Request payload: {json.dumps(update_data, indent=2)}")
        print_info(f"Using Authorization header with token: {admin_token[:20]}...")
        
        response = requests.put(url, json=update_data, headers=headers, timeout=10)
        
        print_info(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_info(f"Response Data: {json.dumps(data, indent=2)}")
            
            # Verify the update was applied
            if data.get('title_en') == update_data['title_en']:
                print_success("Title update verified")
            else:
                print_error("Title was not updated correctly")
                return False
                
            if data.get('description_en') == update_data['description_en']:
                print_success("Description update verified")
            else:
                print_error("Description was not updated correctly")
                return False
                
            print_success("Cookie Consent Admin Update API test passed")
            return True
        else:
            print_error(f"API returned status code {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except json.JSONDecodeError as e:
        print_error(f"Invalid JSON response: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        return False

def test_cookie_consent_update_no_auth():
    """Test cookie consent update without authentication"""
    print_test_header("Cookie Consent Update API - No Auth")
    
    try:
        url = f"{BACKEND_URL}/admin/cookie-consent-settings"
        update_data = {"title_en": "Should fail"}
        
        response = requests.put(url, json=update_data, timeout=10)
        
        if response.status_code == 401:
            print_success("Correctly rejected request without auth token (401)")
            return True
        else:
            print_error(f"Expected 401 status for no auth, got {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print(f"{Colors.BOLD}FOMO Crypto Platform - Backend API Testing{Colors.ENDC}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    test_results = {}
    
    # Test 1: Cookie Consent GET API
    test_results['cookie_consent_get'] = test_cookie_consent_get()
    
    # Test 2: Admin Login API
    login_success, admin_token = test_admin_login()
    test_results['admin_login'] = login_success
    
    # Test 3: Admin Login with invalid password
    test_results['admin_login_invalid'] = test_admin_login_invalid_password()
    
    # Test 4: Cookie Consent Update API (requires auth)
    test_results['cookie_consent_update'] = test_cookie_consent_update(admin_token)
    
    # Test 5: Cookie Consent Update without auth
    test_results['cookie_consent_update_no_auth'] = test_cookie_consent_update_no_auth()
    
    # Summary
    print_test_header("Test Summary")
    
    passed_tests = sum(1 for result in test_results.values() if result)
    total_tests = len(test_results)
    
    for test_name, result in test_results.items():
        status = "PASSED" if result else "FAILED"
        color = Colors.GREEN if result else Colors.RED
        print(f"{color}{test_name}: {status}{Colors.ENDC}")
    
    print(f"\n{Colors.BOLD}Overall Result: {passed_tests}/{total_tests} tests passed{Colors.ENDC}")
    
    if passed_tests == total_tests:
        print_success("All backend tests passed!")
        return 0
    else:
        print_error(f"{total_tests - passed_tests} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())