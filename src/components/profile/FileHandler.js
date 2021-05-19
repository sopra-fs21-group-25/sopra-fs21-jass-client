import {api} from "../../helpers/api";
import React from 'react';

class UploadFilesService {
    upload(file, userId, onUploadProgress) {
        console.log(this.state);
        let formData = new FormData();

        formData.append("file", file);

        console.log(formData)

        const response = api.post("/files/"+ userId, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
    }

    getFiles(userId) {
        return api.get("/files/" + userId);
    }
}

export default new UploadFilesService();
