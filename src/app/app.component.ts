import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Firestore } from 'firebase/firestore';
import { auth } from './firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ParqueaderoPI';
}
