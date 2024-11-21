import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Firestore,getDocs ,collection,query,where} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { firestore } from '../../firebase.config';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  email: string = '';
  password: string = '';
  role: string = '';
  loginEmail: string = '';
  loginPassword: string = '';
  error: boolean = false;
  errorMessage: string = '';

  user$!: Observable<User>

  constructor(private authService: AuthService, private router: Router) {}

signUp(email: string, password: string) {
  this.authService.signUp(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      this.email = '';
      this.password = '';
      this.role = '';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === 'auth/invalid-email') {
        alert('Invalid email format. Please enter a valid email.');
      } else if (errorCode === 'auth/email-already-in-use') {
        alert('This email is already registered. Please use a different email.');
      } else {
        alert('An error occurred: ' + errorMessage);
      }
    });
}


passwordSignIn(email: string, password: string) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, this.loginEmail, this.loginPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      this.error = false;
      this.errorMessage = '';
      console.log("Successfully signed in");

      // Check if the user exists and navigate accordingly
      this.checkUserProfile(user);
    })
    .catch((err) => {
      const errorCode = err.code;
      const errorMessage = err.message;

      this.error = true;

      switch (errorCode) {
        case 'auth/invalid-email':
          this.errorMessage = 'This email address is invalid.';
          break;
        case 'auth/user-disabled':
          this.errorMessage = 'This email address is disabled by the administrator.';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'This email address is not registered.';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'The password is invalid or the user does not have a password.';
          break;
        default:
          this.errorMessage = errorMessage;
          break;
      }
    });
}

signInWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      this.error = false;
      this.errorMessage = '';
      console.log("Successfully signed in with Google");

      // Check if the user exists and navigate accordingly
      this.checkUserProfile(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      this.error = true;
      this.errorMessage = `Error signing in with Google: ${errorMessage}`;
    });
}

getAllUsers(): Promise<any[]> {
  const usersCollectionRef = collection(firestore, 'users');
  return getDocs(usersCollectionRef).then((querySnapshot) => {
    let usersList: any[] = [];
    querySnapshot.forEach((doc) => {
      usersList.push(doc.data());
    });
    return usersList;
  });
}







checkUserProfile(user: any) {
  const userEmail = user.email;
  const usersCollection = collection(firestore, 'users');
  const emailQuery = query(usersCollection, where('email', '==', userEmail));

  getDocs(emailQuery).then((querySnapshot) => {
    if (!querySnapshot.empty) {
      // User found
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        console.log("User found with profile:", userData);
        console.log("User email found : ",userEmail);

        
        if (userData['role'] === "administrador") {
          this.router.navigate(['pages/Main']);
        } else {
          this.router.navigate(['pages/editPerfilU']);
        }

        
        this.authService.setEmail(userEmail);
        console.log("email inicio: ", localStorage.getItem('userEmail'));
      });
    } else {
      
      console.log("No profile found for this email.", userEmail);
      localStorage.setItem('LIemail',userEmail);
      this.router.navigate(['pages/Perfil']);
    }
  }).catch((error) => {
    console.error("Error checking user profile by email: ", error);
    this.router.navigate(['pages/Perfil']);
  });
}

}
