import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';

interface User {
  email: string;
  // Add other user properties
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8081/api/auth/user';
  private readonly USER_KEY = 'currentUser';
  private readonly EMAIL_KEY = 'emailFG';  // New constant for email key

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize user from localStorage
    this.initializeUser();
  }

  // Add the public method to get email here
  public getEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  private initializeUser(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        if (this.user?.email) {
          // Save the email to emailFG key only if the user and email exist
          localStorage.setItem(this.EMAIL_KEY, this.user.email);
        }
      } catch (e) {
        this.clearUser();
      }
    }
  }
  
  private user: User | null = null;

  fetchUser(): Observable<User | null> {
    return this.http.get<User>(this.authUrl, { withCredentials: true }).pipe(
      tap(user => {
        this.setUser(user);
        console.log('User Email:', user.email); // Add this line to log the email
        return user;
      }),
      catchError(error => {
        this.clearUser();
        return of(null);
      })
    );
  }

  private setUser(user: User): void {
    this.user = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    // Save the email to emailFG key
    localStorage.setItem(this.EMAIL_KEY, user.email);
  }

  private clearUser(): void {
    this.user = null;
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EMAIL_KEY);  // Remove the email when clearing user
  }

  isAuthenticated(): Observable<boolean> {
    if (!this.user) {
      return this.fetchUser().pipe(
        map(user => !!user),  // Convert User | null to boolean
        catchError(() => of(false))
      );
    }
    return of(true);
  }
  
  login(): void {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  }

  logout(): void {
    this.http.post('http://localhost:8081/logout', {}, {
      withCredentials: true
    }).subscribe({
      next: () => {
        this.clearUser();
        this.router.navigate(['/pages/auth']);
      },
      error: () => {
        this.clearUser();
        this.router.navigate(['/pages/auth']);
      }
    });
  }
}
