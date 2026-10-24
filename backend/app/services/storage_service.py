"""
Storage service for audio file management.
Uploads to Firebase Cloud Storage or local static audio directory for dev.
"""

import os
import uuid
import logging
from typing import Optional
from pathlib import Path

from app.core.config import settings
from app.core.firebase import get_storage_bucket, is_mock_mode

logger = logging.getLogger(__name__)

# Local uploads directory for offline/dev storage
LOCAL_UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


class StorageService:
    """Service for managing audio recordings in Cloud Storage or local fallback."""

    def __init__(self):
        self.bucket = get_storage_bucket()
        self.use_mock = self.bucket is None or is_mock_mode()

    def upload_audio(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str = "audio/webm",
    ) -> dict:
        """
        Upload an audio file to Storage bucket or local media storage.
        """
        unique_id = uuid.uuid4().hex[:10]
        safe_filename = f"{unique_id}_{filename}"

        if not self.use_mock and self.bucket:
            try:
                file_path = f"audio/{safe_filename}"
                blob = self.bucket.blob(file_path)
                blob.upload_from_string(file_bytes, content_type=content_type)
                blob.make_public()
                return {
                    "file_path": file_path,
                    "public_url": blob.public_url,
                    "file_size_bytes": len(file_bytes),
                    "content_type": content_type,
                }
            except Exception as e:
                logger.warning("Cloud Storage upload failed, storing locally: %s", e)

        # Local storage fallback
        dest_path = LOCAL_UPLOAD_DIR / safe_filename
        with open(dest_path, "wb") as f:
            f.write(file_bytes)

        logger.info("Stored audio locally at %s", dest_path)
        return {
            "file_path": f"/uploads/{safe_filename}",
            "public_url": f"/audio/{safe_filename}",
            "file_size_bytes": len(file_bytes),
            "content_type": content_type,
        }

    def delete_audio(self, file_path: str) -> bool:
        """Delete an audio file."""
        if not self.use_mock and self.bucket:
            try:
                blob = self.bucket.blob(file_path)
                blob.delete()
                return True
            except Exception:
                pass

        local_path = LOCAL_UPLOAD_DIR / os.path.basename(file_path)
        if local_path.exists():
            local_path.unlink()
            return True
        return False
