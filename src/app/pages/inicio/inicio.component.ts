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
import { UsuariosService } from '../../services/usuarios.service';
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

  constructor(private usuarioServicio: UsuariosService, private router: Router) {}

signUp(email: string, password: string) {

  
}





}
