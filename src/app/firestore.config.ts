// firestore.config.ts
import { Injectable } from '@angular/core';
import { auth, firestore } from './firebase.config'; // Import firestore from firebase.config.ts
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  // Method to get the user profile from Firestore using their UID
  getUserProfile(uid: string) {
    const userRef = doc(firestore, 'users', uid); // Use imported firestore instance
    return getDoc(userRef); // Returns a promise with the document snapshot
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        const usersRef = collection(firestore, 'users'); // Use imported firestore instance

        // Define the user document data
        const newUser = {
          uid: user.uid,  // Unique user ID from Firebase Authentication
          email: user.email,  // User email
          role: 1,  // User role or any other field
          profileComplete: false  // Indicates if the profile is complete
        };

        // Add user data to Firestore
        return addDoc(usersRef, newUser)
          .then(() => {
            console.log('User profile created');
            this.router.navigate(['pages/Main']); // Navigate to main page
          })
          .catch((error) => {
            console.error('Error adding user profile: ', error);
          });
      })
      .catch((error) => {
        console.error('Error signing up: ', error);
      });
  }
}
