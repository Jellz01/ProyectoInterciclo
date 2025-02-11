import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EspaciosService {

  private authUrl = 'http://localhost:8081/espacios';

  constructor(private http: HttpClient) { }

  getCantEspacios(): Observable<{ id: number; cantidadEspacios: number }[]> {
    return this.http.get<{ id: number; cantidadEspacios: number }[]>(this.authUrl);
  }

  actualizarEspacios(cantidad_espacios: number): Observable<any> {
    return this.http.put(this.authUrl, { cantidadEspacios: cantidad_espacios });
  }
}
