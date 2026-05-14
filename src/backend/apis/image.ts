// src/backend/apis/image.ts
import axios from "axios";
import Compressor from "compressorjs";
import type { AxiosProgressEvent } from "axios";

function blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, { type: blob.type });
}

export async function compressImage(image: File): Promise<File> {
    return new Promise((resolve, reject) => {
        new Compressor(image, {
            quality: 0.6,
            success(result) {
                const compressedImage = blobToFile(result, image.name);
                resolve(compressedImage);
            },
            error(err) {
                reject(err);
            },
        });
    });
}

export async function uploadImage(
    image: File,
    folderName: string,
    onProgress?: (progressEvent: AxiosProgressEvent) => void
) {
    const file = new File([image], image.name || "image.jpg");
    const formData = new FormData();
    formData.append("folder", folderName);
    formData.append("image", file);

    const { data } = await axios.post(import.meta.env.PUBLIC_FILE_UPLOAD_URL!, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            username: import.meta.env.PUBLIC_FILE_UPLOAD_ID,
            password: import.meta.env.PUBLIC_FILE_UPLOAD_PASS,
        },
        onUploadProgress: onProgress,
    });

    return data.files.image;
}
