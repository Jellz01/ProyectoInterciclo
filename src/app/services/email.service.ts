import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:8081/api/email/send'; // URL de tu backend

  constructor(private http: HttpClient) { }

  sendEmail(emailData: any): Observable<any> {
    // Realizamos una petición POST con los datos del correo
    console.log("Email: ",emailData);
    return this.http.post(this.apiUrl, emailData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' // Indicamos que los datos son JSON
      })
    });
  }
}
