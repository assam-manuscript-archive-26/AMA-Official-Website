// src/backend/apis/audio.ts
import axios from "axios";
import type { AxiosProgressEvent } from "axios";

const FILE_UPLOAD_URL = import.meta.env.PUBLIC_FILE_UPLOAD_URL || "https://uploads.backendservices.in/api";
const FILE_UPLOAD_ID = import.meta.env.PUBLIC_FILE_UPLOAD_ID || "internship";
const FILE_UPLOAD_PASS = import.meta.env.PUBLIC_FILE_UPLOAD_PASS || "internship@2025";

export async function uploadAudio(
    audio: File,
    folderName: string,
    onProgress?: (progressEvent: AxiosProgressEvent) => void
) {
    const formData = new FormData();
    formData.append("folder", folderName);
    formData.append("audio", audio);

    const { data } = await axios.post(
        FILE_UPLOAD_URL,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                username: FILE_UPLOAD_ID,
                password: FILE_UPLOAD_PASS,
            },
            onUploadProgress: onProgress,
        }
    );

    return data.files.audio;
}

