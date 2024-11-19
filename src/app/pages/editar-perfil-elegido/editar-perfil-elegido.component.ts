import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { AuthService } from '../../firestore.config';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-editar-perfil-elegido',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './editar-perfil-elegido.component.html',
  styleUrls: ['./editar-perfil-elegido.component.scss']
})
export class EditarPerfilElegidoComponent {
  userForm: FormGroup;

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
    console.log("Entiororjnbhnjbuy")
  }

  async ngOnInit(): Promise<void> {
    // Retrieve the email from local storage
    const storedEmail = localStorage.getItem('editarEmail');
    if (storedEmail) {
      try {
        // Query Firestore for user data based on email
        const userDocRef = doc(db, 'users', storedEmail);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data fetched:", userData); // Added log to verify fetched data
          
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
      // Merge the new data with the existing user data
      await setDoc(userRef, {
        apellido: this.userForm.value.apellido,
        cedula,
        email,
        fechaNac: new Date(this.userForm.value.fecha_nacimiento),
        nombre: this.userForm.value.nombre,
        telefono: this.userForm.value.telefono,
        role: rol
      }, { merge: true });

      console.log("User data has been successfully written to Firestore.");

      // Navigate to another page and reload to reflect changes
      this.router.navigate(['pages/Main']).then(() => {
        window.location.reload(); // Reload the page to ensure data is updated
      });
      
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }
}
