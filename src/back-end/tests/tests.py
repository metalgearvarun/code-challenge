import pytest
from fastapi.testclient import TestClient
# Import your FastAPI app. Adjust the import path if your app is defined elsewhere.
from main import app  # or from your_module.main import app

client = TestClient(app)

# Known public and private folder IDs based on your data.json
PUBLIC_FOLDER_IDS = [
    "folder_002",
    "folder_003",
    "folder_005",
    "folder_006",
    "folder_008"
]
PRIVATE_FOLDER_ID = "folder_001"
UNKNOWN_FOLDER_ID = "nonexistent"


def test_read_public_folders():
    response = client.get("/public-folders")
    assert response.status_code == 200
    folders = response.json()
    assert isinstance(folders, list)
    # Ensure no private folder is returned
    returned_ids = [f["id"] for f in folders]
    assert PRIVATE_FOLDER_ID not in returned_ids
    # Ensure exactly the expected public folders are returned
    assert set(returned_ids) == set(PUBLIC_FOLDER_IDS)


def test_read_public_folder_files_success():
    # Test files for one known public folder
    folder_id = PUBLIC_FOLDER_IDS[0]
    response = client.get(f"/public-folders/{folder_id}/files")
    assert response.status_code == 200
    files = response.json()
    assert isinstance(files, list)
    # Each returned item should have required fields
    for file in files:
        assert all(key in file for key in (
            "name", "created", "updated", "type"))


def test_read_public_folder_files_not_found():
    response = client.get(f"/public-folders/{UNKNOWN_FOLDER_ID}/files")
    assert response.status_code == 404


def test_read_public_folder_files_private_forbidden():
    response = client.get(f"/public-folders/{PRIVATE_FOLDER_ID}/files")
    assert response.status_code == 403


def test_public_files_endpoint():
    response = client.get("/public-files")
    assert response.status_code == 200
    files = response.json()
    assert isinstance(files, list)
    # Ensure a known private file is not present
    names = [f["name"] for f in files]
    assert "Project Proposal.pdf" not in names


if __name__ == "__main__":
    pytest.main([__file__])
