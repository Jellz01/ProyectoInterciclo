import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Espacio {
  id: number;
  espacio: string;
  placa: string;
  fechaHoraIngreso: string;

}

@Injectable({
  providedIn: 'root'
})
export class EspaciosService {
  private apiUrl = 'http://localhost:8081/espacios';

  constructor(private http: HttpClient) {}

  getEspacios(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(this.apiUrl);
  }

  // Method to delete a space by its ID
  deleteByPlaca(placa: string): 
  
  Observable<any> {
    console.log("placa servicio",placa);
    return this.http.delete(`${this.apiUrl}/${placa}`);
  }
}
