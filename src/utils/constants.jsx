//for development use
export const API_BASE_URL = 'http://localhost:8080/api/v1';

//for production use, replace with the actual API base URL
//export const API_BASE_URL = 'http://139.84.236.226:8081/api/v1';

//MAIN ISSUE
//-------------
// issue with the [production API_BASE_URL]:
// The API_BASE_URL is set to 'http' but the server is running on 'https'.
// This mismatch can cause CORS issues and prevent the frontend from communicating with the backend.    
// To resolve this, ensure that the API_BASE_URL uses 'https' if the server is configured for secure connections.

