import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterOutlet } from "@angular/router";
import { FormularioService } from "../../services/formulario.service";
import { RolesService, Role } from "../../services/roles.service";
import { NgFor, NgIf } from "@angular/common";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgIf, NgFor],
  templateUrl: './crear-us-f.component.html',
  styleUrls: ['./crear-us-f.component.scss']
})
export class CrearUsFComponent implements OnInit {
  formulario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    cedula: '',
    role: '',
    fechaNacimiento: ''
  };

  roles: Role[] = [];
  errorMessages: string[] = [];

  constructor(
    private formularioService: FormularioService,
    private roleService: RolesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchUserAndEmail();
    this.getRoles();
  }

  private fetchUserAndEmail(): void {
    this.authService.fetchUser().subscribe({
      next: (user) => {
        if (user?.email) {
          this.formulario.email = user.email;
        }
        console.log('Formulario after fetching user and email:', this.formulario); // Log after fetching user email
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.formulario.email = this.authService.getEmail() || '';
        console.log('Formulario after error fetching user email:', this.formulario); // Log after error fetching user email
      }
    });
  }

  getRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        console.log("Nig",data);
        console.log('Roles fetched:', this.roles); // Log after roles are fetched
      },
      error: (err) => console.error('Error al obtener roles', err)
    });
  }

  isFormValid(): boolean {
    this.errorMessages = [];
    const telValid = this.formulario.telefono.length === 10 && /^\d+$/.test(this.formulario.telefono);
    const cedulaValid = this.formulario.cedula.length === 10 && /^\d+$/.test(this.formulario.cedula);
  
    if (!this.formulario.nombre) this.errorMessages.push('El nombre es obligatorio.');
    if (!this.formulario.apellido) this.errorMessages.push('El apellido es obligatorio.');
    if (!this.formulario.email) this.errorMessages.push('El email es obligatorio.');
    if (!telValid) this.errorMessages.push('Teléfono inválido (10 dígitos requeridos)');
    if (!cedulaValid) this.errorMessages.push('Cédula inválida (10 dígitos requeridos)');
    if (!this.formulario.role) this.errorMessages.push('Seleccione un rol');
    if (!this.formulario.fechaNacimiento) this.errorMessages.push('Fecha de nacimiento requerida');
  
    console.log('Form validation errors:', this.errorMessages); // Log validation errors
    return this.errorMessages.length === 0;
  }

  onSubmit() {
    console.log('Formulario before submit:', this.formulario); // Log before submit
    console.log('Nombre:', this.formulario.nombre);
    console.log('Apellido:', this.formulario.apellido);
    console.log('Email:', this.formulario.email);
    console.log('Telefono:', this.formulario.telefono);
    console.log('Cedula:', this.formulario.cedula);
    console.log('Role:', this.formulario.role);
    console.log('Fecha de Nacimiento:', this.formulario.fechaNacimiento);
  
    if (this.isFormValid()) {
      this.formularioService.crearFormulario(this.formulario).subscribe({
        next: (response) => {
          this.resetFormWithEmail();
          this.router.navigate(['/pages/Main']);
        },
        error: (err) => {
          this.errorMessages = ['Error del servidor. Por favor intente nuevamente.'];
          console.error('Error creando el formulario', err);
        }
      });
    }
  }
  

  private resetFormWithEmail(): void {
    this.formulario = {
      nombre: '',
      apellido: '',
      email: this.authService.getEmail() || '', // Preserve email
      telefono: '',
      cedula: '',
      role: '',
      fechaNacimiento: ''
    };
    this.errorMessages = [];
    console.log('Formulario after reset:', this.formulario); // Log after form reset
  }
}
