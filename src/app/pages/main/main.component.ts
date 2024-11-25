import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { getDocs, collection, query, setDoc, doc, deleteDoc, where } from "firebase/firestore";
import { firestore, db } from "../../firebase.config";
import { CommonModule, NgForOf, NgFor, NgIf } from "@angular/common";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgForOf, NgFor, NgIf, CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  // Configuration variables
  horaApertura: string = '08:00';
  horaCierre: string = '20:00';
  numeroParqueos: number = 10;
  tarifas: { hora: number; dia: number; mes: number } = { hora: 0, dia: 0, mes: 0 };
  diasApertura: string[] = []; // Example: ['Lunes', 'Martes', 'Miércoles']

  // Vehicle tracking
  placasEnParqueadero: string[] = [];
  placasOcupadas: { [key: string]: number } = {};
  
  // User-related properties
  emailU: string = '';
  users: any[] = [];
  role: string = "";

  parqueadero!: HTMLElement;
  placaIngreso: string = '';
  placaSalida: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.fetchParkingConfigurations();
    await this.loadAllParkingData();
  }

  // Navigation methods
  gestionarParqueadero(): void {
    this.router.navigate(['pages/configParqueo']);
  }

  listarUsuarios(): void {
    this.router.navigate(['pages/listar']);
  }

  listarContratos(): void {
    this.router.navigate(['pages/listarCon']);
  }

  gestionarContrato(): void {
    this.router.navigate(['/pages/contratos']);
  }

  guardarEmail(): void {
    this.emailU = localStorage.getItem('userEmail') as string;
    console.log("final", this.emailU);
    localStorage.setItem('userEmail', this.emailU);
    this.editarPerfil();
  }

  editarPerfil(): void {
    this.router.navigate(['pages/editar']);
    console.log("Email del usuario Guardado: ", localStorage.getItem('userEmail'));
  }

  // Data loading methods
  private async loadAllParkingData(): Promise<void> {
    try {
      // Reset parking data
      this.placasOcupadas = {};
      
      // Load plates from both sources
      await Promise.all([
        this.fetchPlatesFromFirestore(),
        this.fetchPlatesFromContratos()
      ]);

      // Configure parking display once after all data is loaded
      this.configurarParqueadero();
      this.updatePlateList();
    } catch (error) {
      console.error('Error loading parking data:', error);
    }
  }

  // Fetch parking configurations from Firestore
  async fetchParkingConfigurations(): Promise<void> {
    try {
      const collectionRef = collection(firestore, 'parqueo-configuraciones');
      const q = query(collectionRef);
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const configDoc = querySnapshot.docs[0];
        const configData = configDoc.data();
  
        this.horaApertura = configData['horaApertura'] || this.horaApertura;
        this.horaCierre = configData['horaCierre'] || this.horaCierre;
        this.numeroParqueos = configData['numeroParqueos'] || this.numeroParqueos;
        this.tarifas = configData['tarifas'] || this.tarifas;

       

        this.diasApertura = Array.isArray(configData['diasOperacion'])
          ? configData['diasOperacion']
          : ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        this.updateConfigurationDisplay();
      }
    } catch (error) {
      console.error('Error fetching parking configuration:', error);
      alert('No se pudo cargar la configuración del parqueadero');
    }
  }

  async fetchPlatesFromFirestore(): Promise<void> {
    try {
      const platesCollection = collection(db, 'placas');
      const querySnapshot = await getDocs(platesCollection);
  
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        this.placasOcupadas[data['placa']] = Number(data['espacioId']);
      });
  
      console.log("Placas recuperadas desde Firestore:", this.placasOcupadas);
    } catch (error) {
      console.error("Error al recuperar las placas desde Firestore: ", error);
    }
  }

  async fetchPlatesFromContratos(): Promise<void> {
    try {
      const contratosCollection = collection(db, 'contratos');
      const querySnapshot = await getDocs(contratosCollection);
  
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const placa = data['placaContrato'].toUpperCase();
        const espacioId = Number(data['espacioContrato']);
  
        // Only add if the space is not already occupied
        if (!Object.values(this.placasOcupadas).includes(espacioId)) {
          this.placasOcupadas[placa] = espacioId;
        } else {
          console.warn(`Espacio ${espacioId} ya está ocupado. No se puede asignar a ${placa}`);
        }
      });
  
      console.log("Placas recuperadas desde Contratos:", this.placasOcupadas);
    } catch (error) {
      console.error("Error al recuperar las placas desde Contratos: ", error);
    }
  }

  // UI update methods
  private updateConfigurationDisplay(): void {
    const elements = {
      tarifaHora: document.getElementById('infoTarifaHora'),
      tarifaDia: document.getElementById('infoTarifaDia'),
      tarifaMes: document.getElementById('infoTarifaMes'),
      horarioApertura: document.getElementById('horarioApertura'),
      horarioCierre: document.getElementById('horarioCierre'),
      numeroParqueosInfo: document.getElementById('numeroParqueosInfo'),
      diasApertura: document.getElementById('diasApertura'),
    };
    localStorage.setItem('np', this.numeroParqueos.toString());

    if (elements.tarifaHora) elements.tarifaHora.textContent = `${this.tarifas.hora}`;
    if (elements.tarifaDia) elements.tarifaDia.textContent = `${this.tarifas.dia}`;
    if (elements.tarifaMes) elements.tarifaMes.textContent = `${this.tarifas.mes}`;
    if (elements.horarioApertura) elements.horarioApertura.textContent = this.horaApertura;
    if (elements.horarioCierre) elements.horarioCierre.textContent = this.horaCierre;
    if (elements.numeroParqueosInfo) elements.numeroParqueosInfo.textContent = this.numeroParqueos.toString();
    if (elements.diasApertura) elements.diasApertura.textContent = this.diasApertura.join(', ');
  }

  configurarParqueadero(): void {
    this.parqueadero = document.getElementById('parqueadero') as HTMLElement;
    if (!this.parqueadero) {
      console.error('Elemento parqueadero no encontrado');
      return;
    }
    
    this.parqueadero.innerHTML = '';
  
    for (let i = 1; i <= this.numeroParqueos; i++) {
      const espacio = document.createElement('div');
      espacio.className = 'espacio';
      espacio.dataset['espacio'] = i.toString();
  
      // Find plate for this space
      const placa = Object.entries(this.placasOcupadas)
        .find(([_, espacioId]) => espacioId === i)?.[0];
      
      if (placa) {
        espacio.classList.add('ocupado');
      }
      
      espacio.innerHTML = placa
        ? `<span class="placa">${placa}</span>`
        : `Espacio ${i}`;
      
      this.parqueadero.appendChild(espacio);
      
      console.log(`Espacio ${i} -> Placa: ${placa || 'No asignada'}`);
    }
  }

  updatePlateList(): void {
    const listaPlacasContenido = document.getElementById('listaPlacasContenido') as HTMLUListElement;
    if (!listaPlacasContenido) {
      console.error('Elemento listaPlacasContenido no encontrado');
      return;
    }

    listaPlacasContenido.innerHTML = '';
  
    for (const placa of Object.keys(this.placasOcupadas)) {
      const li = document.createElement('li');
      li.textContent = `${placa} - Espacio ${this.placasOcupadas[placa]}`;
      listaPlacasContenido.appendChild(li);
    }
  }

  // Parking space management methods
  ocuparEspacio(): void {
    const placaInput = document.getElementById('placaIngreso') as HTMLInputElement;
    if (!placaInput) {
      console.error('Elemento placaIngreso no encontrado');
      return;
    }

    const placa: string = placaInput.value.toUpperCase().trim();
  
    if (!placa) {
      alert("Por favor ingrese una placa.");
      return;
    }

    if (this.placasOcupadas[placa]) {
      alert("Esta placa ya está registrada en el parqueadero.");
      return;
    }

    // Find first available space
    const espaciosOcupados = new Set(Object.values(this.placasOcupadas));
    let espacioDisponible: number | null = null;

    for (let i = 1; i <= this.numeroParqueos; i++) {
      if (!espaciosOcupados.has(i)) {
        espacioDisponible = i;
        break;
      }
    }

    if (espacioDisponible === null) {
      alert("No hay espacios disponibles en el parqueadero.");
      return;
    }

    // Assign the space and update
    this.placasOcupadas[placa] = espacioDisponible;
    placaInput.value = '';
    this.savePlateToFirestore(placa, espacioDisponible);
    this.configurarParqueadero();
    this.updatePlateList();
  }

  salirEspacio(): void {
    const placaInput = document.getElementById('placaSalida') as HTMLInputElement;
    if (!placaInput) {
      console.error('Elemento placaSalida no encontrado');
      return;
    }

    const placa: string = placaInput.value.toUpperCase().trim();
  
    if (!placa) {
      alert("Por favor ingrese una placa.");
      return;
    }

    if (!this.placasOcupadas[placa]) {
      alert("Esta placa no está registrada en el parqueadero.");
      return;
    }

    delete this.placasOcupadas[placa];
    placaInput.value = '';
    this.removePlateFromFirestore(placa);
    this.configurarParqueadero();
    this.updatePlateList();
  }

  // Firestore operations
  savePlateToFirestore(placa: string, espacioId: number): void {
    const platesCollection = collection(db, 'placas');
    const checkPlateQuery = query(platesCollection, where("placa", "==", placa));
    
    getDocs(checkPlateQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          console.log("La placa ya está registrada en Firestore.");
          alert("Placa Ya se encuentra registrada");
          return;
        }

        return setDoc(doc(platesCollection, placa), {
          placa: placa,
          espacioId: Number(espacioId),
          timestamp: new Date()
        });
      })
      .then(() => {
        console.log("Placa guardada exitosamente en Firestore!");
      })
      .catch((error) => {
        console.error("Error al guardar la placa: ", error);
      });
  }

  removePlateFromFirestore(placa: string): void {
    const platesCollection = collection(db, 'placas');
    const plateQuery = query(platesCollection, where("placa", "==", placa));
  
    getDocs(plateQuery)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No se encontró ninguna placa con ese valor en Firestore.");
          return;
        }

        const deletePromises = querySnapshot.docs.map(doc => 
          deleteDoc(doc.ref)
            .then(() => {
              console.log(`Placa ${placa} eliminada exitosamente de Firestore.`);
            })
            .catch((error) => {
              console.error("Error al eliminar la placa: ", error);
            })
        );

        return Promise.all(deletePromises);
      })
      .catch((error) => {
        console.error("Error al buscar la placa en Firestore: ", error);
      });
  }
}