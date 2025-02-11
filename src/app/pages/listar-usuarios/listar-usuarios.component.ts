import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormularioService } from '../../services/formulario.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListarUsuariosComponent implements OnInit {
  users: any[] = [];
  userForm: any;
  emailU: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private formularioService: FormularioService
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
      this.getUserByEmail(this.emailU)
        .then(user => {
          console.log("User data:", user);
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
      console.warn("No email found for user.");
    }
  }

  getAllUsers() {
    this.formularioService.getTodosLosUsuarios().subscribe(
      (data) => {
        console.log("Users retrieved:", data);
        this.users = data;
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }

  deleteUser(emaill: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.formularioService.deleteUsuarioElegido(emaill).subscribe(
        () => {
          console.log(`Usuario con correo ${emaill} eliminado correctamente`);
          this.getAllUsers(); // Actualiza la lista tras eliminación
        },
        (error) => {
          console.error("Error eliminando usuario:", error);
        }
      );
    }
  }
    
  async getUserByEmail(emailU: string): Promise<any> {
    return firstValueFrom(this.formularioService.getPersonaPorEmail(emailU));
  }
}
