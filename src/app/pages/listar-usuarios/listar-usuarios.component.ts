import { Component } from '@angular/core';
import { FormsModule, NgForm, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { getDocs, query, where, collection, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase.config';
import { NgForOf, NgIf } from '@angular/common';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListarUsuariosComponent {
  users: any[] = [];
  userForm: any;
  emailU: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      apellido: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.emailU = this.authService.getEmail();

    if (this.emailU) {
      this.getUserByEmail(this.emailU).then(user => {
        if (user) {
          console.log("Retrieved user data:", user);

          // Patch form with retrieved user data
          this.userForm.patchValue({
            apellido: user.apellido,
            cedula: user.cedula,
            email: user.email,
            telefono: user.telefono,
            nombre: user.nombre,
            fecha_nacimiento: user.fechaNac ? new Date(user.fechaNac.seconds * 1000).toISOString().substring(0, 10) : '',
            rol: user.role || 'defaultRole'  // Assign 'role' or default value
          });
        }
      }).catch(error => console.error('Error fetching user data:', error));
    } else {
      console.warn("No email found for user.");
    }
  }

  getAllUsers(): Promise<any[]> {
    const usersCollectionRef = collection(firestore, 'users');
    return getDocs(usersCollectionRef).then((querySnapshot) => {
      let usersList: any[] = [];
      querySnapshot.forEach((doc) => {
        usersList.push(doc.data());
      });
      this.users = usersList;  // Make sure the data is assigned to users array
      return usersList;
    });
  }

  getUserByEmail(emailU: string): Promise<any> {
    const usersCollectionRef = collection(firestore, 'users');
    const q = query(usersCollectionRef, where('email', '==', emailU)); // Filter by email
    return getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('No user found with that email.');
        return null; // Return null if no user is found
      } else {
        const user = querySnapshot.docs[0].data(); // Get the first matching user
        return user;
      }
    }).catch(error => {
      console.error('Error fetching user by email: ', error);
      return null; // Handle errors
    });
  }

  editUser(email: string): void {
    this.getUserByEmail(email).then(user => {
      if (user) {
        
        console.log("Email para editar: ",email);
        this.authService.setEmailEditar(email);
        
        // Navigate to the edit user page and pass the user data
        this.router.navigate(['pages/editarPerfilE'], { 
          state: { userData: user }  // Pass user data as state
        });
      } else {
        console.log('User not found.');
      }
    }).catch(error => console.error('Error editing user:', error));
  }

  deleteUser(email: string): void {
    console.log("Email: ", email);
    console.log('Deleting user:', email);

    // Fetch the user by email to get the user document reference
    const usersCollectionRef = collection(firestore, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));

    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('No user found with that email.');
      } else {
        const userDocRef = doc(firestore, 'users', querySnapshot.docs[0].id);  // Get the document reference

        // Delete the user document
        deleteDoc(userDocRef)
          .then(() => {
            console.log(`User with email ${email} deleted successfully.`);
            this.getAllUsers();  // Refresh the list of users
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
          });
      }
    }).catch(error => {
      console.error('Error fetching user by email for deletion:', error);
    });
  }
}
