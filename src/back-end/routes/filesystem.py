import json
import re
import time
from enum import Enum
from pathlib import Path
from typing import List, Optional

from auth import extract_token
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.requests import Request
from log_config import logger
from pydantic import BaseModel, validator

router = APIRouter()

# The file model


class File(BaseModel):
    name: str
    created: str
    updated: str
    type: str

# Filetypes enum


class FileType(str, Enum):
    document = "document"
    image = "image"
    video = "video"
    audio = "audio"

# Folder model


class Folder(BaseModel):
    id: str
    name: str
    created: str
    updated: str

    # Validate the filename, must start with a letter
    @validator('name')
    def name_must_start_with_letter(cls, v: str) -> str:
        if not re.match(r'^[A-Za-z]', v):
            raise ValueError('filename must start with a letter')
        return v


# Load the JSON data at startup
# Can potentially cause race condititions if this gets updated
_data_path = Path(__file__).parent.parent / "db" / "data.json"
_data = json.loads(_data_path.read_text())

_folders = _data["foldersById"]
_files = _data["filesById"]


# Get public folders, no authentication
@router.get("/public-folders", response_model=List[Folder])
def get_public_folders():
    # Example logging
    logger.info("Get public folders")
    public = []
    for fid, folder in _folders.items():
        if not folder["isPrivate"]:
            public.append(
                Folder(
                    id=fid,
                    name=folder["name"],
                    created=folder["created"],
                    updated=folder["updated"],
                )
            )
    return public

# Use fastapi rate limiter
# @limiter.limit("5/minute")


@router.get("/public-folders/{folder_id}/files", response_model=List[File])
def read_public_folder_files(folder_id: str, file_type: Optional[FileType] = Query(None)):
    folder = _folders.get(folder_id)
    if not folder:
        raise HTTPException(404, "Folder not found")
    if folder["isPrivate"]:
        raise HTTPException(403, "Folder is private")

    results: List[File] = []
    for fid in folder["fileIds"]:
        file_data = _files.get(fid)
        if not file_data:
            continue

        # optional type filter
        if file_type and file_data["type"] != file_type.value:
            continue

        # build the File in a clear, field-by-field way
        file_out = File(
            name=file_data["name"],
            created=file_data["created"],
            updated=file_data["updated"],
            type=file_data["type"],
        )
        results.append(file_out)

    return results

# Get private folder, expects a bearer token


@router.get("/private-folders", response_model=List[Folder])
def get_private_folders(request: Request, tokenPayload: dict = Depends(extract_token)):
    private = []
    for fid, folder in _folders.items():
        private.append(
            Folder(
                id=fid,
                name=folder["name"],
                created=folder["created"],
                updated=folder["updated"],
            )
        )
    return private


@router.get("/private-folders/{folder_id}/files", response_model=List[File],)
def read_private_folder_files(request: Request, tokenPayload: dict = Depends(extract_token), folder_id: str = None, file_type: Optional[FileType] = Query(None)):
    time.sleep(1)
    folder = _folders.get(folder_id)
    if not folder:
        raise HTTPException(404, "Folder not found")

    results: List[File] = []
    for fid in folder["fileIds"]:
        file_data = _files.get(fid)
        if not file_data:
            continue

        # optional type filter
        if file_type and file_data["type"] != file_type.value:
            continue

        # build the File in a clear, field-by-field way
        file_out = File(
            name=file_data["name"],
            created=file_data["created"],
            updated=file_data["updated"],
            type=file_data["type"],
        )
        results.append(file_out)

    return results


@router.get("/public-files", response_model=List[File])
def get_public_files(file_type: Optional[FileType] = Query(None)):
    public_ids = {
        fid
        for folder in _folders.values()
        if not folder["isPrivate"]
        for fid in folder["fileIds"]
    }

    # filter and return
    result = [
        _files[fid]
        for fid in public_ids
        if (file_type is None or _files[fid]["type"] == file_type.value)
    ]
    return result


@router.get("/private-files", response_model=List[File])
def get_private_files(request: Request, tokenPayload: dict = Depends(extract_token), file_type: Optional[FileType] = Query(None)):
    public_ids = {
        fid
        for folder in _folders.values()
        if folder["isPrivate"]
        for fid in folder["fileIds"]
    }

    # filter and return
    result = [
        _files[fid]
        for fid in public_ids
        if (file_type is None or _files[fid]["type"] == file_type.value)
    ]
    return result
