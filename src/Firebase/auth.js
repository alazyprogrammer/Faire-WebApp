import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
};

// Function to sign in user with email and password
export async function signInUserWithEmailAndPassword(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

// Function to send password reset email
export async function sendUserPasswordResetEmail(email) {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        throw error;
    }
};

// Function to sign out the current user
export async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

// Function to update user display name
export const updateUserDisplayName = async (displayName) => {
  const user = auth.currentUser;

  try {
    await updateProfile(user, {
      displayName: displayName,
      // Other fields can be updated here, e.g., photoURL
    });

    return true; // Return true if the update is successful
  } catch (error) {
    console.error('Error updating display name:', error);
    throw error; // Throw an error if the update fails
  }
};

// Function to update user profile picture
export const updateUserProfilePicture = async (file, user, storage) => {
    try {
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      
      await updateProfile(user, {
        photoURL: imageUrl,
      });
  
      return imageUrl; // Return the uploaded image URL
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  };

// Function to send verification mail
export const sendVerificationEmail = async (email) => {
    try {
      await sendEmailVerification(auth.currentUser);
      console.log('Verification email sent to:', email);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email.');
    }
};
