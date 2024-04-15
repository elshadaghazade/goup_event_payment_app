"use client";

import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(event.target.files);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!files || files.length === 0) {
            alert('Please select one or more files first!');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await axios.post('/api/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
                    setProgress(percentCompleted);
                },
            });

            console.log('Files uploaded successfully', response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <>
            <h1>Progress: {progress}%</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} multiple />
                <button type="submit">Upload</button>
            </form>
        </>
    );
}

export default FileUpload;