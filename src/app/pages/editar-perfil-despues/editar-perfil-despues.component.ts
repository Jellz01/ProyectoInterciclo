import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../firestore.config';
import { FormularioService } from '../../services/formulario.service'; // Assuming the service is imported here
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-perfil-despues',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-perfil-despues.component.html',
  styleUrls: ['./editar-perfil-despues.component.scss']
})
export class EditarPerfilDespuesComponent implements OnInit {
  userForm: FormGroup;
  errorMessages: string[] = [];
  userId: number | null = null;
  isDisabled = true;
  private userEmail: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private formularioService: FormularioService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute to access query params
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      fechaNacimiento: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Retrieve the email from localStorage
    this.userEmail = localStorage.getItem('editarEmail');
    console.log('Email from localStorage:', this.userEmail);

    // If an email is found in localStorage, proceed to fetch user data
    if (this.userEmail) {
      this.formularioService.getPersonaPorEmail(this.userEmail).subscribe({
        next: (response) => {
          console.log('API response:', response);
          
          // Assuming the API response has a property `usuarios` which is an array of user objects
          const persona = response.usuarios.find(user => user.email === this.userEmail);
          
          if (persona) {
            this.userId = persona.id;
            console.log('userId:', this.userId);

            this.userForm.patchValue({
              nombre: persona.nombre,
              apellido: persona.apellido,
              email: persona.email,
              telefono: persona.telefono,
              cedula: persona.cedula,
              fechaNacimiento: persona.fechaNacimiento,
              role: persona.role
            });

            console.log('userForm values after patching:', this.userForm.value);
          } else {
            console.error('User with the specified email not found.');
            this.errorMessages = ['Usuario no encontrado con ese correo electrónico.'];
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos de la persona:', error);
          this.errorMessages = ['Error al cargar los datos del usuario'];
        }
      });
    } else {
      console.warn('No email found in localStorage');
    }
  }

  actualizar(): void {
    console.log("Datos jalados en componente:", this.userForm.value);  // Log form values instead of the FormGroup object
    
    if (this.userForm.invalid) {
      this.errorMessages = ['Por favor, complete todos los campos requeridos.'];
      console.log('Form invalid:', this.userForm.invalid);
      return;
    }

    if (!this.userId || !this.userEmail) {
      this.errorMessages = ['Error: Información de usuario no encontrada'];
      console.log('userId or userEmail not found');
      return;
    }

    // Directly passing the form values to update
    const datosActualizados = {
      id: this.userId,
      ...this.userForm.value
    };
    console.log('datosActualizados:', datosActualizados);  // Log the updated user data

    this.formularioService.actualizarPerfil(this.userId, datosActualizados).subscribe({
      next: () => {
        console.log('Profile updated successfully');
        this.router.navigate(['/pages/Main']);
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.errorMessages = ['Error al actualizar el perfil'];
      }
    });
  }
}
