import { Component, OnInit } from '@angular/core';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config'; // Assuming firestore is initialized in this file
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,NgIf],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss']
})
export class EditarPerfilComponent implements OnInit {
  userForm: FormGroup;
  emailU: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
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
    this.emailU = localStorage.getItem("LIemail")
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

  actualizar() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const updatedUser = {
      apellido: this.userForm.value.apellido,
      cedula: this.userForm.value.cedula,
      email: this.userForm.value.email,
      telefono: this.userForm.value.telefono,
      nombre: this.userForm.value.nombre,
      fechaNac: new Date(this.userForm.value.fecha_nacimiento),  // Convert to Firebase timestamp
      role: this.userForm.value.rol
    };

    try {
      const userRef = doc(db, 'users', this.userForm.value.email);
      setDoc(userRef, updatedUser, { merge: true }).then(() => {
        this.router.navigate(['pages/Main']);
        console.log("User data has been successfully updated.");
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
    } catch (error) {
      console.error("Error in actualizar(): ", error);
    }
  }

  getUserByEmail(emailU: string): Promise<any> {
    const usersCollectionRef = collection(db, 'users');
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
}
