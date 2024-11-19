import { Component, OnInit } from '@angular/core';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../firestore.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  userForm: FormGroup;
  emailEntrada: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Ensure emailEntrada is not null by using a fallback value
    this.emailEntrada = localStorage.getItem('LIemail') || 'caca';
  
    this.userForm = this.fb.group({
      apellido: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [this.emailEntrada, [Validators.required, Validators.email]], // Set the default email value
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }
  

  async ngOnInit(): Promise<void> {
    // Retrieve the email from local storage
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      try {
        // Query Firestore for user data based on email
        const userDocRef = doc(db, 'users', storedEmail);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Prefill the form with the user's data
          this.userForm.patchValue({
           
            apellido: userData['apellido'],
            cedula: userData['cedula'],
            email: userData['email'],
            telefono: userData['telefono'],
            nombre: userData['nombre'],
            fecha_nacimiento: userData['fechaNac']
              ? new Date(userData['fechaNac'].seconds * 1000).toISOString().substring(0, 10)
              : '',
            rol: userData['role'] || ''
          });
          
        } else {
          console.error("No user found with the given email.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    } else {
      console.warn("No email found in local storage.");
    }
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
  
    const { cedula, email, rol } = this.userForm.value;
  
    try {
      const userRef = doc(db, 'users', email);
      await setDoc(userRef, {
        apellido: this.userForm.value.apellido,
        cedula,
        email,
        fechaNac: new Date(this.userForm.value.fecha_nacimiento),
        nombre: this.userForm.value.nombre,
        telefono: this.userForm.value.telefono,
        role: rol
      }, { merge: true });
  
      if (rol === "administrador") {
        this.router.navigate(['pages/Main']);
      } else {
        this.router.navigate(['pages/editPerfilU']);
      }
  
      console.log("User data has been successfully written to Firestore.");
  
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }
}
  