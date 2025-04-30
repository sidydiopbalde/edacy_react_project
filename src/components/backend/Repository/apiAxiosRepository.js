import axios from 'axios';

const baseUrl = "http://127.0.0.1:3000/";

const apiRepository = {
    // Fetch data from the server
    fetchData: async (endpoint) => {
        try {
            const response = await axios.get(baseUrl + endpoint, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': '*/*',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            throw new Error(error.response?.data?.error || 'Unknown error occurred');
        }
    },

    // Save data to the server with method support (POST, PUT, PATCH, DELETE)
    saveData: async (endpoint, data, method = 'POST') => {
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': '*/*',
            'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
        };
        // console.log(data instanceof FormData)
        try {
            const config = {
                method: method,
                url: baseUrl + endpoint,
                headers: headers,
                // Set data to null for DELETE requests
                data: method !== 'DELETE' ? data : undefined,
            };

            const response = await axios(config);

            console.log('Response Status:', response.status);
            console.log('Response Body:', response.data);

            return response.data;
        } catch (error) {
            let errorMessage;

            if (error.response) {
                const errorData = error.response.data;
                if (errorData.error) {
                    errorMessage = Array.isArray(errorData.error)
                        ? errorData.error.map(err => `Field: ${err.path.join('.')} - ${err.message}`).join(', ')
                        : errorData.error;
                } else {
                    errorMessage = errorData.message || 'Unknown error occurred';
                }
            } else {
                errorMessage = error.message;
            }

            console.error('Error:', errorMessage);
            throw new Error(errorMessage);
        }
    },

};

export default apiRepository;
