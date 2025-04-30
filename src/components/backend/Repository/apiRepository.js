// apiRepository.js

const baseUrl = "http://127.0.0.1:3000/";

const apiRepository = {
    // Fetch data from the server
    fetchData: async (endpoint) => {
        const response = await fetch(baseUrl + endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
        });
        if (!response.ok) {
            console.log(response);
            throw new Error('Erreur lors de la récupération des données');
        }
        return await response.json();
    },

    // Save data to the server with method support (POST, PUT, PATCH, DELETE)
    saveData: async (endpoint, data, method = 'POST') => {
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': '*/*',
        };

        // If the method is DELETE, do not send the body
        const options = {
            method: method,
            headers: headers,
        };

        if (method !== 'DELETE') {
            options.body = JSON.stringify(data);
        }

    const response = await fetch(baseUrl + endpoint, options);

        const responseBody = await response.text();
        console.log('Response Status:', response.status);
        console.log('Response Body:', responseBody);

        if (!response.ok) {
            let errorMessage;

            try {
                const errorData = JSON.parse(responseBody);
                if (errorData.error) {
                    errorMessage = errorData.error.map(err => {
                        return `Field: ${err.path.join('.')} - ${err.message}`;
                    }).join(', ');
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = 'Unknown error occurred';
                }
                // eslint-disable-next-line no-unused-vars
            } catch (parseError) {
                errorMessage = responseBody;
            }   

            console.error('Error:', errorMessage);
            throw new Error(errorMessage);
        }

        // If response body exists, parse and return it
        return responseBody ? JSON.parse(responseBody) : {};
    },
};

export default apiRepository;
