import json
from enum import Enum
from pathlib import Path
from typing import List, Optional

from auth import extract_token
from fastapi import APIRouter, Depends, Query
from fastapi.requests import Request
from pydantic import BaseModel

router = APIRouter()


class File(BaseModel):
    name: str
    created: str
    updated: str
    type: str


class FileType(str, Enum):
    document = "document"
    image = "image"
    video = "video"
    audio = "audio"


# Load the JSON data at startup
# Can potentially cause race condititions if this gets updated
_data_path = Path(__file__).parent.parent / "db" / "data.json"
_data = json.loads(_data_path.read_text())

_folders = _data["foldersById"]
_files = _data["filesById"]


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
