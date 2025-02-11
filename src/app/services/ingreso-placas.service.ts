import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

// Define the structure of the Espacio object
interface Espacio {
  id?: number;      // Optional, in case you want to send the ID after it's created
  espacio: string;
  placa: string;
}

@Injectable({
  providedIn: 'root'
})
export class IngresoPlacasService {

  private apiUrl = 'http://localhost:8081/espacios';  // Replace with your backend URL
  error: string='';

  constructor(private http: HttpClient) { }

  // Method to create a new Espacio with Placa
  createEspacio(espacio: Espacio): Observable<Espacio> {
    console.log("Espacio en servicio: ",espacio);
    return this.http.post<Espacio>(this.apiUrl, espacio);
  }


  deleteEspacio(espacio: any) {
  return this.http.request('DELETE', 'http://localhost:8080/espacios', {
    body: espacio,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Method to update an existing Espacio
updateEspacio(espacio: Espacio): Observable<Espacio | null> {
  return this.http.put<Espacio>(`${this.apiUrl}/${espacio.id}`, espacio).pipe(
    catchError(err => {
      console.error('Error updating espacio:', err);  // Log the error for debugging purposes
      this.error = 'Unable to update the parking space';  // Optionally set an error message for UI feedback
      return of(null);  // Return null in case of error, indicating a failure in updating
    })
  );
}



  // Method to get all Espacios (parking spaces)
  getEspacios(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(this.apiUrl);
  }
}


