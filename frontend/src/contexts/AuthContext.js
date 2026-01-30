import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService } from '../services';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Send email verification with action code settings
    const actionCodeSettings = {
      url: window.location.origin + '/dashboard',
      handleCodeInApp: true
    };
    await sendEmailVerification(userCredential.user, actionCodeSettings);
    // Register in backend
    await authService.register();
    return userCredential;
  };

  // Login with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Resend verification email
  const resendVerification = async () => {
    if (currentUser && !currentUser.emailVerified) {
      const actionCodeSettings = {
        url: window.location.origin + '/dashboard',
        handleCodeInApp: true
      };
      await sendEmailVerification(currentUser, actionCodeSettings);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // If user is logged in, ensure they're registered in backend
      if (user) {
        try {
          await authService.register();
        } catch (error) {
          console.error('Backend registration error:', error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resendVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
