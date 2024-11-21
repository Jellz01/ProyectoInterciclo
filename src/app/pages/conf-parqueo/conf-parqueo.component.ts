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
  diasOperacion: string[] = []; // Array para almacenar los días seleccionados

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

        // Poblar los inputs con los datos recuperados
        this.horaApertura = configData['horaApertura'] || '08:00';
        this.horaCierre = configData['horaCierre'] || '20:00';
        this.numeroParqueos = configData['numeroParqueos'] || 10;
        this.tarifas = configData['tarifas'] || { hora: 0, dia: 0, mes: 0 };
        this.diasOperacion = configData['diasOperacion'] || [];

        // Actualizar valores de los inputs
        if (this.horaAperturaInput) this.horaAperturaInput.nativeElement.value = this.horaApertura;
        if (this.horaCierreInput) this.horaCierreInput.nativeElement.value = this.horaCierre;
        if (this.numeroParqueosInput) this.numeroParqueosInput.nativeElement.value = this.numeroParqueos.toString();
        if (this.tarifaHoraInput) this.tarifaHoraInput.nativeElement.value = this.tarifas.hora.toString();
        if (this.tarifaDiaInput) this.tarifaDiaInput.nativeElement.value = this.tarifas.dia.toString();
        if (this.tarifaMesInput) this.tarifaMesInput.nativeElement.value = this.tarifas.mes.toString();

        // Marcar los días seleccionados
        this.diasOperacion.forEach((dia) => {
          const checkbox = document.getElementById(dia) as HTMLInputElement;
          if (checkbox) checkbox.checked = true;
        });
      }
    } catch (error) {
      console.error('Error fetching parking configuration:', error);
      alert('No se pudo cargar la configuración del parqueadero');
    }
  }

  async configurarYDefinir(): Promise<void> {
    // Obtener valores de los inputs
    this.horaApertura = this.horaAperturaInput.nativeElement.value || '08:00';
    this.horaCierre = this.horaCierreInput.nativeElement.value || '20:00';
    this.numeroParqueos = parseInt(this.numeroParqueosInput.nativeElement.value || '10');

    this.tarifas.hora = parseFloat(this.tarifaHoraInput.nativeElement.value || '0');
    this.tarifas.dia = parseFloat(this.tarifaDiaInput.nativeElement.value || '0');
    this.tarifas.mes = parseFloat(this.tarifaMesInput.nativeElement.value || '0');

    // Capturar los días seleccionados
    const checkboxes = document.querySelectorAll('#diasOperacion input[type="checkbox"]');
    this.diasOperacion = Array.from(checkboxes)
      .filter((checkbox: any) => checkbox.checked)
      .map((checkbox: any) => checkbox.id);

    // Guardar la configuración en Firestore
    await this.saveOrUpdateConfigurationToFirestore();
  }

  async saveOrUpdateConfigurationToFirestore(): Promise<void> {
    try {
      const parqueoData = {
        horaApertura: this.horaApertura,
        horaCierre: this.horaCierre,
        numeroParqueos: this.numeroParqueos,
        tarifas: this.tarifas,
        diasOperacion: this.diasOperacion, // Guardar los días seleccionados
      };

      const collectionRef = collection(firestore, 'parqueo-configuraciones');
      const q = query(collectionRef);
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        await updateDoc(doc(firestore, 'parqueo-configuraciones', existingDoc.id), parqueoData);
      } else {
        await addDoc(collectionRef, parqueoData);
      }

      alert('Configuración guardada correctamente');
      this.router.navigate(['pages/Main']);
    } catch (error) {
      console.error('Error al guardar la configuración en Firestore:', error);
      alert('No se pudo guardar la configuración del parqueadero');
    }
  }
}
