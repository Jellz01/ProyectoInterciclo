import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Tarifa {
  id: number;
  hora: number;
  dia: number;
  mes: number;
}


@Injectable({
  providedIn: 'root'
})
export class TarifasService {
  private apiUrl = 'http://localhost:8081/tarifas';  

  constructor(private http: HttpClient) { }

  getTarifas(): Observable<Tarifa[]> {  // Corrected method name
    return this.http.get<Tarifa[]>(this.apiUrl).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
