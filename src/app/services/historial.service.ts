import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Historial {
  id?: number;
  espacio: string;
  placa: string;
  fechaHoraIngreso: string;

  
}

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private apiUrl = 'http://localhost:8081/historial';

  constructor(private http: HttpClient) { }

  // Method to create a new Espacio with Placa
  guardarHistorial(historial: Historial): Observable<any> {
    console.log("Historial entry", historial);
    return this.http.post(this.apiUrl, historial); // Use the apiUrl directly if it's already complete
}

  
    // Method to retrieve all Espacios
  getEspacios(): Observable<Historial[]> {

    
    return this.http.get<Historial[]>(this.apiUrl);
    
  }
  
}
