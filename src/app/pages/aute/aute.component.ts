import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aute',
  standalone: true,
  imports: [CommonModule], // Use CommonModule instead of individual directives
  templateUrl: './aute.component.html',
  styleUrls: ['./aute.component.scss']
})
export class AuteComponent implements OnInit {
  http = inject(HttpClient);
  user: any = null; // Removed signal, using a plain variable for user

  ngOnInit() {
    this.checkAuth();
  }

  checkAuth() {
    this.http.get('http://localhost:8081/api/user', { 
      withCredentials: true 
    }).subscribe({
      next: (res: any) => {
        this.user = res; 
        console.log("Joseph",res);
        if (res?.email) {
          localStorage.setItem('emailSB', res.email);
        }
      },
      error: () => {
        this.user = null; // Reset the user property on error
        // Clear email from localStorage on error
        localStorage.removeItem('emailSB');
      }
    });
  }

  // Method to store the clicked email in localStorage
  saveClickedEmail(email: string) {
    localStorage.setItem('emailSB', email);
  }

  login() {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  }

  logout() {
    this.http.post('http://localhost:8081/logout', {}, { 
      withCredentials: true 
    }).subscribe(() => {
      this.user = null; // Reset the user on logout
      // Clear email from localStorage on logout
      localStorage.removeItem('emailSB');
    });
  }
}
