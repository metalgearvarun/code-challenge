import json
from enum import Enum
from pathlib import Path
from typing import List, Optional

from auth import extract_token
from fastapi import APIRouter, Depends, HTTPException, Query
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


class Folder(BaseModel):
    id: str
    name: str
    created: str
    updated: str


# Load the JSON data at startup
# Can potentially cause race condititions if this gets updated
_data_path = Path(__file__).parent.parent / "db" / "data.json"
_data = json.loads(_data_path.read_text())

_folders = _data["foldersById"]
_files = _data["filesById"]


@router.get("/public-folders", response_model=List[Folder])
def get_public_folders():
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


@router.get("/public-folders/{folder_id}/files", response_model=List[File],)
def read_public_folder_files(folder_id: str):
    folder = _folders.get(folder_id)
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    if folder["isPrivate"]:
        raise HTTPException(status_code=403, detail="Folder is private")
    # gather and return the files
    return [
        File(**_files[file_id])
        for file_id in folder["fileIds"]
        if file_id in _files
    ]


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
def read_private_folder_files(request: Request, tokenPayload: dict = Depends(extract_token), folder_id: str = None):
    folder = _folders.get(folder_id)
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return [
        File(**_files[file_id])
        for file_id in folder["fileIds"]
        if file_id in _files
    ]


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
