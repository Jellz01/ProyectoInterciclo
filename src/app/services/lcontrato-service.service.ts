import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LcontratoServiceService {
  private apiUrl = 'http://localhost:8081/contratos';

  constructor(private http: HttpClient) { }

  // Get all contracts
  getContratos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Create new contract
  crearFormulario(contrato: any): Observable<any> {
    return this.http.post(this.apiUrl, contrato, { observe: 'response' }).pipe(
      catchError(error => {
        console.error('Error completo:', error);
        throw error;
      })
    );
  }

  // Update contract
  updateContrato(id: number, contrato: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, contrato).pipe(
      catchError(this.handleError)
    );
  }

  // Delete contract
  deleteContrato(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
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
