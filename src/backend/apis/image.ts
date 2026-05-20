// src/backend/apis/image.ts
import axios from "axios";
import Compressor from "compressorjs";
import type { AxiosProgressEvent } from "axios";

const FILE_UPLOAD_URL = import.meta.env.PUBLIC_FILE_UPLOAD_URL || "https://uploads.backendservices.in/api";
export const IMAGE_URL = import.meta.env.PUBLIC_IMAGE_URL || "https://uploads.backendservices.in/storage/";
const FILE_UPLOAD_ID = import.meta.env.PUBLIC_FILE_UPLOAD_ID || "internship";
const FILE_UPLOAD_PASS = import.meta.env.PUBLIC_FILE_UPLOAD_PASS || "internship@2025";

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

    const { data } = await axios.post(FILE_UPLOAD_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            username: FILE_UPLOAD_ID,
            password: FILE_UPLOAD_PASS,
        },
        onUploadProgress: onProgress,
    });

    return data.files.image;
}

