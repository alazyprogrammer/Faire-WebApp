import axios from 'axios';
import { getCurrentBaseUrl } from '../utils';

// API base URL
const PORT = '3000'
const BASE_URL = getCurrentBaseUrl(PORT);
console.log('Base Url: ', BASE_URL);
const API_URL = `${BASE_URL}/users`;

// Function to fetch tasks for the current user
export const getUserByEmail = async (email) => {
    try {
        console.log("email: " + email);
        // Make a GET request to the user API with the email as a query parameter
        const response = await axios.post(`${API_URL}/`, {
            email
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Return null if the user is not found
            return null;
        } else {
            // Throw error for other cases
            console.error('Error fetching user by email:', error);
            throw error;
        }
    }
};