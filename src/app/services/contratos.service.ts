import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

export interface Contrato {
  id?: number;
  clienteId: string;
  espacio: string;
  placa: string;
  fechaInicio: string;
  fechaFinal: string;
  total: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private apiUrl = 'http://localhost:8081/contratos'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los contratos
  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.apiUrl);
  }

  // Obtener un contrato por ID
  getContratoById(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo contrato
 // En tu servicio (contratos.service.ts)
createContrato(contrato: Contrato): Observable<Contrato> {
  console.log("Datos enviados:", contrato);
  
  return this.http.post<Contrato>(this.apiUrl, contrato, {
    headers: { 'Content-Type': 'application/json' } // Fuerza el encabezado JSON
  }).pipe(
    tap(response => console.log('Respuesta del servidor:', response)),
    catchError(error => {
      console.error('Error en la petición:', error);
      throw error;
    })
  );
}

  // Actualizar un contrato existente
  updateContrato(id: number, contrato: Contrato): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.apiUrl}/${id}`, contrato);
  }

  // Eliminar un contrato
  deleteContrato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
