// src/backend/apis/audio.ts
import axios from "axios";
import type { AxiosProgressEvent } from "axios";

export async function uploadAudio(
    audio: File,
    folderName: string,
    onProgress?: (progressEvent: AxiosProgressEvent) => void
) {
    const formData = new FormData();
    formData.append("folder", folderName);
    formData.append("audio", audio);

    const { data } = await axios.post(
        import.meta.env.PUBLIC_FILE_UPLOAD_URL!,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                username: import.meta.env.PUBLIC_FILE_UPLOAD_ID,
                password: import.meta.env.PUBLIC_FILE_UPLOAD_PASS,
            },
            onUploadProgress: onProgress,
        }
    );

    return data.files.audio;
}
