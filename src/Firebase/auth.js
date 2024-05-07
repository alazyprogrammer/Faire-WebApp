import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from ".";

// Function to create a new user with email and password
export async function signUpUserWithEmailAndPassword(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Send email verification
        await sendEmailVerification(userCredential.user);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

// Function to sign in user with email and password
export async function signInUserWithEmailAndPassword(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

// Function to send password reset email
export async function sendUserPasswordResetEmail(email) {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        throw error;
    }
}

// Function to sign out the current user
export async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
}
