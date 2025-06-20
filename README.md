# code-challenge
Created with CodeSandbox

# Backend
A containerized python application using FastAPI. Returns the folders and files, both private and public. Private access requires a bearer token. The tests are executed in a seperate container

To run the backend, execute the following from the backend directory
1. `docker build -f Dockerfile -t code-challenge:latest .`
2. `docker run -p 8000:8000 code-challenge:latest`
To run the tests
1. `docker build -f Dockerfile.test -t backend-tests .`
2. `docker run --rm backend-tests`

# Frontend
A typescript application that uses MUI to list the folders and files for selected folders. There are additional options to sort and filer the files. A login button provides the option to login
and access to private folders by passing a bearer token to the server

To run the frontend, start the backend and execute the following from the front-end folder
1. `npm i`
2. `npm start`

# Future work
1. Add retries on client, server if necessary (for database connections)
2. Cache commonly accessed folders on the backend
3. Add a sidecar container running fluentbit for logging
4. Pagination to enable performace and viewing folders for large number of files
5. Secrets come in from something like secrets manager and set into the container as env variables
6. Spwan multiple threads using uvicorn on the backend
7. Support different filetypes/handle unknown types
