import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cedula: string;
  role: string;
  fechaNacimiento: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  private apiUrl = "http://localhost:8081/formularios";


  constructor(private http: HttpClient) { }


 // formulario.service.ts
crearFormulario(formulario: any): Observable<any> {
  return this.http.post(this.apiUrl, formulario, { observe: 'response' }).pipe(
    catchError(error => {
      console.error('Error completo:', error);
      throw error;
    })
  );
}

getTodosLosUsuarios(): Observable<Usuario[]> {
  return this.http.get<{ usuarios: Usuario[] }>(this.apiUrl).pipe(
    map((response: { usuarios: Usuario[] }) => response.usuarios), // Especificar tipo de 'response'
    catchError(error => {
      console.error('Error al obtener todos los usuarios:', error);
      return throwError(() => new Error('Error al obtener todos los usuarios'));
    })
  );
}


deleteUsuarioElegido(email: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${email}`).pipe(
    catchError(error => {
      console.error('Error al eliminar el usuario:', error);
      return throwError(() => new Error('Error al eliminar el usuario'));
    })
  );
}




getPersonaPorEmail(email: string): Observable<{ usuarios: Usuario[] }> {
  const params = new HttpParams().set('email', email);
  console.log('Sending request with params:', params.toString()); // Debugging

  return this.http.get<{ usuarios: Usuario[] }>(this.apiUrl, { params }).pipe(
    catchError(error => {
      console.error('Error al obtener personas por email:', error);
      return throwError(() => new Error('Error al obtener personas por email'));
    })
  );
}


actualizarPerfil(id: number, formulario: Usuario): Observable<any> {
  const url = `${this.apiUrl}/${id}`;  // Use the ID in the URL path

  // El formulario ya contiene los valores, no es necesario acceder a .value
  console.log('Formulario recibido:', formulario);

  return this.http.put(url, formulario).pipe(
    catchError(error => {
      console.error('Error al actualizar el perfil:', error);
      const errorMsg = error.statusText || 'Error desconocido';
      return throwError(() => new Error(`Error al actualizar el perfil: ${errorMsg}`));
    })
  );
}






validarUsuarioExiste(email: string): Observable<boolean> {
  const params = new HttpParams().set('email', email);

  return this.http.get<boolean>(`${this.apiUrl}/existe`, { params }).pipe(
    catchError(error => {
      console.error('Error al verificar existencia del usuario:', error);
      return throwError(() => new Error('Error en la verificación de usuario'));
    })
  );
}



}

