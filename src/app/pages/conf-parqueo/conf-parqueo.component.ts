import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { firestore } from '../../firebase.config';
import { collection, addDoc, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conf-parqueo',
  standalone: true,
  templateUrl: './conf-parqueo.component.html',
  styleUrls: ['./conf-parqueo.component.scss'],
})
export class ConfParqueoComponent implements OnInit {
  @ViewChild('horaAperturaInput') horaAperturaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('horaCierreInput') horaCierreInput!: ElementRef<HTMLInputElement>;
  @ViewChild('numeroParqueosInput') numeroParqueosInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tarifaHoraInput') tarifaHoraInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tarifaDiaInput') tarifaDiaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tarifaMesInput') tarifaMesInput!: ElementRef<HTMLInputElement>;

  horaApertura: string = '08:00';
  horaCierre: string = '20:00';
  numeroParqueos: number = 10;
  tarifas: { hora: number; dia: number; mes: number } = { hora: 0, dia: 0, mes: 0 };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadConfigurationFromFirestore();
  }

  async loadConfigurationFromFirestore(): Promise<void> {
    try {
      const collectionRef = collection(firestore, 'parqueo-configuraciones');
      const q = query(collectionRef);
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const configDoc = querySnapshot.docs[0];
        const configData = configDoc.data();

        // Populate form inputs with fetched data
        if (this.horaAperturaInput) {
          this.horaAperturaInput.nativeElement.value = configData['horaApertura'] || '08:00';
        }
        if (this.horaCierreInput) {
          this.horaCierreInput.nativeElement.value = configData['horaCierre'] || '20:00';
        }
        if (this.numeroParqueosInput) {
          this.numeroParqueosInput.nativeElement.value = configData['numeroParqueos']?.toString() || '10';
        }
        if (this.tarifaHoraInput) {
          this.tarifaHoraInput.nativeElement.value = configData['tarifas']?.hora?.toString() || '0';
        }
        if (this.tarifaDiaInput) {
          this.tarifaDiaInput.nativeElement.value = configData['tarifas']?.dia?.toString() || '0';
        }
        if (this.tarifaMesInput) {
          this.tarifaMesInput.nativeElement.value = configData['tarifas']?.mes?.toString() || '0';
        }

        // Update component properties
        this.horaApertura = configData['horaApertura'] || '08:00';
        this.horaCierre = configData['horaCierre'] || '20:00';
        this.numeroParqueos = configData['numeroParqueos'] || 10;
        this.tarifas = configData['tarifas'] || { hora: 0, dia: 0, mes: 0 };
      }
    } catch (error) {
      console.error('Error fetching parking configuration:', error);
      alert('No se pudo cargar la configuración del parqueadero');
    }
  }

  async configurarYDefinir(): Promise<void> {
    // Retrieve values from inputs
    this.horaApertura = this.horaAperturaInput.nativeElement.value || '08:00';
    this.horaCierre = this.horaCierreInput.nativeElement.value || '20:00';
    this.numeroParqueos = parseInt(this.numeroParqueosInput.nativeElement.value || '10');

    this.tarifas.hora = parseFloat(this.tarifaHoraInput.nativeElement.value || '0');
    this.tarifas.dia = parseFloat(this.tarifaDiaInput.nativeElement.value || '0');
    this.tarifas.mes = parseFloat(this.tarifaMesInput.nativeElement.value || '0');

    // Display alert for tariffs
    alert(`Tarifas definidas:\nHora: $${this.tarifas.hora}\nDía: $${this.tarifas.dia}\nMes: $${this.tarifas.mes}`);

    // Save or update the configuration in Firestore
    await this.saveOrUpdateConfigurationToFirestore();
  }

  async saveOrUpdateConfigurationToFirestore(): Promise<void> {
    try {
      const parqueoData = {
        horaApertura: this.horaApertura,
        horaCierre: this.horaCierre,
        numeroParqueos: this.numeroParqueos,
        tarifas: this.tarifas,
      };

      // Reference to the collection
      const collectionRef = collection(firestore, 'parqueo-configuraciones');

      // Check if a configuration already exists
      const q = query(collectionRef);
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If a configuration exists, update the first document
        const existingDoc = querySnapshot.docs[0];
        await updateDoc(doc(firestore, 'parqueo-configuraciones', existingDoc.id), parqueoData);
        console.log('Configuración actualizada en Firestore:', parqueoData);
        this.router.navigate(['pages/Main']);

        
      } else {
        // If no configuration exists, add a new document
        await addDoc(collectionRef, parqueoData);
        console.log('Nueva configuración guardada en Firestore:', parqueoData);
        this.router.navigate(['pages/Main']);
      }

      // Optional: Reload the configuration to reflect the latest changes
      await this.loadConfigurationFromFirestore();
    } catch (error) {
      console.error('Error al guardar la configuración en Firestore:', error);
      alert('No se pudo guardar la configuración del parqueadero');
    }
  }
}