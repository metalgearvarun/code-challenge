# code-challenge
Created with CodeSandbox

Future work
1. Add retries on client, server if necessary (for database connections)
2. Cache commonly accessed folders
3. Logging happens via a sidecar container
4. Pagination
5. Secrets come in from something like secrets manager and set into the container as env variables
6. Spwan multiple threads using uvicorn
7. Support different filetypes/handle unknown types
8. Use @field_validator() to validate data