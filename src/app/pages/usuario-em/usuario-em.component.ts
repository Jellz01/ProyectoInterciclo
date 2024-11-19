import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { AuthService } from '../../firestore.config';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-usuario-em',
  standalone: true,
  templateUrl: './usuario-em.component.html',
  imports: [NgIf,ReactiveFormsModule,NgFor],
  styleUrls: ['./usuario-em.component.scss']
})
export class UsuarioEmComponent implements OnInit {

  userForm: FormGroup;
  emailEntrada: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.emailEntrada = localStorage.getItem('LIemail') || '';
    this.userForm = this.fb.group({
      apellido: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [this.emailEntrada, [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    const storedEmail = localStorage.getItem('LIemail');
    if (storedEmail) {
      try {
        const userDocRef = doc(db, 'users', storedEmail);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
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
          console.error("No user found with the provided email.");
          console.log("fecha de naciiento: ",)
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    } else {
      console.warn("No email found in local storage.");
    }
  }

  async actualizar() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { cedula, email, rol } = this.userForm.value;

    try {
      const userRef = doc(db, 'users', email);
      await setDoc(userRef, {
        ...this.userForm.value,
        role: rol
      });
      alert("Información actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar: ", error);
      alert("Hubo un error al actualizar la información.");
    }
  }
}
