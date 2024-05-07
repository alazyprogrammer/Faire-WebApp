import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../../Firebase";

// Create a context for authentication
const AuthContext = React.createContext();

// Custom hook to access the authentication context
export function useAuth() {
    return useContext(AuthContext);
}

// Authentication provider component
export function AuthProvider({ children }) {
    // State to hold the current user
    const [user, setUser] = useState(null);
    // State to track if a user is logged in
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    // State to track loading state while initializing the user
    const [loading, setLoading] = useState(true);
    // State to track if the user already exists in Firebase based on email
    const [userExists, setUserExists] = useState(false);

    // Effect to listen for authentication state changes
    useEffect(() => {
        // Subscribe to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        // Cleanup function to unsubscribe from auth state changes when component unmounts
        return unsubscribe;
    }, []);

    // Function to initialize the user based on authentication state
    async function initializeUser(user) {
        if (user) {
            // If user is logged in
            setUser({ ...user }); // Set the user object
            setUserLoggedIn(true); // Set userLoggedIn to true
        } else {
            // If user is not logged in
            setUser(null); // Set user to null
            setUserLoggedIn(false); // Set userLoggedIn to false
        }
        setLoading(false); // Set loading to false once user initialization is complete
    }

    // Function to check if a user already exists in Firebase based on email
    async function checkUserExists(email) {
        const auth = getAuth();
        try {
            // Fetch sign-in methods for the provided email
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            // If sign-in methods are returned, user exists
            setUserExists(signInMethods.length > 0);
        } catch (error) {
            console.error("Error checking if user exists:", error);
        }
    }

    // Value object to provide to the context
    const value = {
        user, // Current user object
        userLoggedIn, // Boolean indicating if user is logged in
        loading, // Boolean indicating if user data is still loading
        userExists, // Boolean indicating if user already exists in Firebase based on email
        checkUserExists // Function to check if a user exists in Firebase based on email
    };

    // Provide the AuthContext.Provider with the value object
    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Render children only when loading is false */}
        </AuthContext.Provider>
    );
}
