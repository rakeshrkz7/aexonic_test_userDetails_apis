# aexonic_test_userDetails_apis

API's Created:

Note: 
    * Mongodb atlas as been used foe db(Daas) for relatime data availability
    * Postman collection is also included (Nodejs_Test_User_details.postman_collection.json) 
    * Access token will be provided when the new user is registered/updated

1. Create a login api with auth. 
    For login(requires access token):
        POST: http://localhost:5000/api/auth
    To get logged in user details(requires access token):
        GET: http://localhost:5000/api/auth

2. Create a registration api (first name, last name, email, password, mobile no, address):
    New User Registration:
        POST: http://localhost:5000/api/users 

3. List api for all users with token and pagination:
    List of all user((requires access token)):
        GET: http://localhost:5000/api/users?limit=5&skip=2   

4. Update user details api with token:
    Update registered user(requires access token):
        PUT: http://localhost:5000/api/users

5. Search api on (first name, last name, email, mobile no) single key with token and pagination:
    Search user details(requires access token):
        PUT: http://localhost:5000/api/users/search?limit=1