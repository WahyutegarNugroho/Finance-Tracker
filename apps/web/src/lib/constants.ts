export const FIREBASE_ERRORS: Record<string, string> = {
  'auth/user-not-found': 'Email not registered. Please sign up.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/weak-password': 'Password is too weak.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
};
