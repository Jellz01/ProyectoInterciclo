import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargarDatosService {

  constructor() { }
  private userDataSource = new BehaviorSubject<any>(null);
  currentUserData = this.userDataSource.asObservable();

  setUserData(data: any) {
    this.userDataSource.next(data);
  }
}
