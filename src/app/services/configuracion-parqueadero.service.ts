import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionParqueaderoService {

  private apiUrl = 'http://localhost:8081/api/configuracionParqueadero'

  constructor(private http: HttpClient) { }


  updateConfiguracion(configuraciones: any): Observable<any> {
    const url = `${this.apiUrl}/1`;  // Corrected string interpolation with backticks
    return this.http.put(url, configuraciones);
  }


  getConfiguraciones(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCantEspacios(): Observable<number> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.configuraciones[0]?.cant_espacios || 0)
    );
  }

  getTarifas(): Observable<{ hora: number, dia: number, mes: number }> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const config = response.configuraciones[0] || {}; // Get the first configuration
        return {
          hora: Number(config.tarifa_hora) || 0,
          dia: Number(config.tarifa_dia) || 0,
          mes: Number(config.tarifa_mes) || 0
        };
      })
    );
  }
  

  
  
  
}

