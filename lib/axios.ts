"use client";

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Function to sleep for a certain amount of time
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to retry a request a given number of times
const retryRequest = async (error: AxiosError, retries: number, delay: number): Promise<AxiosResponse> => {
    while (retries > 0) {
        try {
            await sleep(delay);
            return await axiosInstance.request(error.config!);  // Retry the request with the original config
        } catch (err: any) {
            if (!err?.response || err?.response?.status !== 500) {
                throw err;  // Throw non-500 errors or if no response
            }
            retries--;  // Decrement retries left
        }
    }
    throw new Error('Max retries reached');
};

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => response,  // If the response is successful, just return it
    async (error: AxiosError) => {
        if (error.response && error.response.status === 500) {
            // Retry the request up to 3 times with a delay of 1000 ms
            return retryRequest(error, 3, 1000);
        }
        return Promise.reject(error);  // If it's not a 500 error, just reject the promise
    }
);

export default axiosInstance;