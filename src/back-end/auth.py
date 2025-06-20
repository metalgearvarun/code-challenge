from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.requests import Request
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def getApiPermissions(apiName):
    # Define permissions for different API groups
    write_permissions = ['create:file', 'create:folder']
    read_permissions = ['read:file']
    admin_permissions = ['system:admin']

    # Group APIs by their required permissions
    read_apis = {
        'get_private_files', 'get_private_folders', 'read_private_folder_files'
    }

    write_apis = {
    }

    admin_apis = {
    }

    # Use set membership for efficient lookup
    if apiName in read_apis:
        return read_permissions
    elif apiName in write_apis:
        return write_permissions
    elif apiName in admin_apis:
        return admin_permissions
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"API '{apiName}' not found in any permission group.")


def check_permissions(required_permissions: list, user_permissions: list):
    print(
        f"check_permissions: Required: {required_permissions}, User has: {user_permissions}")

    if not all(permission in user_permissions for permission in required_permissions):
        raise HTTPException(status_code=403, detail="Permission denied")


def validate_token(token: str):
    print('tokennn')
    print(token)
    try:
        if (token == 'asd'):
            return True
        return False
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


def validate_token_permissions(required_permissions: list, token: str, request: Request):
    is_token_valid = validate_token(token)
    if not is_token_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_permissions = ['read:file']
    check_permissions(required_permissions, user_permissions)


def extract_token(request: Request, token: str = Depends(oauth2_scheme)) -> Optional[str]:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    required_permissions = getApiPermissions(request.scope['route'].name)
    return validate_token_permissions(required_permissions, token, request)
