import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrearUsuarioService {

  private apiUrl = 'http://localhost:8081/usuarios';

  constructor(private http: HttpClient) { }

  crearUsuario(usuarioData: any): Observable<any> {
    return this.http.post(this.apiUrl, usuarioData);
  }

  getEmail(): Observable<string> {
    return this.http.get<{ message: string }>(this.apiUrl)
      .pipe(
        map(response => {
          // Extract the email from the message string
          const emailMatch = response.message.match(/\(([^)]+)\)/);
          return emailMatch ? emailMatch[1] : '';
        })
      );
  }

  crearusuario(){

  }
}
