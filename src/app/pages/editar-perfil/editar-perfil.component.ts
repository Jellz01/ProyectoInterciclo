import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormularioService, Usuario } from '../../services/formulario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-editar-perfil-elegido',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
})
export class EditarPerfilComponent implements OnInit {
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
    // Extract email from query parameters
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email']; // Extract email from query param
      console.log('Email from query params:', this.userEmail);
    
      // Check if email is not null and store it in localStorage
      if (this.userEmail !== null) {
        localStorage.setItem('emailSB', this.userEmail); 
        console.log("Stored email in localStorage:", this.userEmail); // Store email if it exists
      } else {
        localStorage.setItem('emailSB', '');
        console.log("No email provided, setting default in localStorage");
      }
    });
  
    if (this.userEmail) {
      this.formularioService.getPersonaPorEmail(this.userEmail).subscribe({
        next: (response) => {
          console.log('API response:', response);
          
          // Find the user with the matching email
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
    }
  }
  
  actualizar(): void {
    console.log("Datos jalados en componente : ", this.userForm.value);  // Log form values instead of the FormGroup object
    
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

    const datosActualizados: Usuario = {
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
