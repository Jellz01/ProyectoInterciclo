import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Tarifa {
  id: number;
  horaApertura: String;
  horaCierre: String;
 
}
@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  private apiUrl = "http://localhost:8081/horarios";
 
  constructor(private http: HttpClient) { }

  getHorarios(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
