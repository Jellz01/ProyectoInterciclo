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

  ngOnInit(): void {
    this.fetchParkingConfigurations();
    this.fetchPlatesFromFirestore();
  }


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
  // Navigation methods
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

        this.configurarParqueadero();
        this.updateConfigurationDisplay();
      }
    } catch (error) {
      console.error('Error fetching parking configuration:', error);
      alert('No se pudo cargar la configuración del parqueadero');
    }
  }

  // Update configuration display in the UI
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
  
    if (elements.tarifaHora) elements.tarifaHora.textContent = `${this.tarifas.hora}`;
    if (elements.tarifaDia) elements.tarifaDia.textContent = `${this.tarifas.dia}`;
    if (elements.tarifaMes) elements.tarifaMes.textContent = `${this.tarifas.mes}`;
    if (elements.horarioApertura) elements.horarioApertura.textContent = this.horaApertura;
    if (elements.horarioCierre) elements.horarioCierre.textContent = this.horaCierre;
    if (elements.numeroParqueosInfo) elements.numeroParqueosInfo.textContent = this.numeroParqueos.toString();
    if (elements.diasApertura) elements.diasApertura.textContent = this.diasApertura.join(', ');
  }

  // Configure parking spaces
  configurarParqueadero(): void {
    this.parqueadero = document.getElementById('parqueadero') as HTMLElement;
    this.parqueadero.innerHTML = '';
  
    for (let i = 1; i <= this.numeroParqueos; i++) {
      const espacio = document.createElement('div');
      espacio.className = 'espacio';
      espacio.dataset['espacio'] = i.toString();

      const placa = Object.keys(this.placasOcupadas).find(key => this.placasOcupadas[key] === i);
      espacio.innerHTML = placa
        ? `<span class="placa">${placa}</span>`
        : `Espacio ${i}`;

      this.parqueadero.appendChild(espacio);
    }
  }

  // Occupy a parking space
  ocuparEspacio(): void {
    const placaInput = document.getElementById('placaIngreso') as HTMLInputElement;
    const placa: string = placaInput?.value.toUpperCase() || '';
  
    if (placa === "" || this.placasOcupadas[placa]) {
      alert("Ingrese una placa válida o que no esté ya ocupada.");
      return;
    }
  
    const espacio = document.querySelector('.espacio:not(.ocupado)') as HTMLElement;
    if (espacio) {
      espacio.classList.add('ocupado');
      espacio.innerHTML = `<span class="placa">${placa}</span>`;
      this.placasOcupadas[placa] = parseInt(espacio.dataset['espacio'] || "0");
      placaInput.value = '';
      this.updatePlateList();
      this.savePlateToFirestore(placa, this.placasOcupadas[placa]);
    } else {
      alert("No hay espacios disponibles.");
    }
  }

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
          espacioId: espacioId,
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

  // Remove a vehicle from a parking space
  salirEspacio(): void {
    const placaInput = document.getElementById('placaSalida') as HTMLInputElement;
    const placa: string = placaInput?.value.toUpperCase() || '';
  
    const espacioNum = this.placasOcupadas[placa];
    const espacio = document.querySelector(`.espacio[data-espacio="${espacioNum}"]`) as HTMLElement;
    if (espacio) {
      espacio.classList.remove('ocupado');
      espacio.innerHTML = `Espacio ${espacioNum}`;
      delete this.placasOcupadas[placa];
      placaInput.value = '';
      this.updatePlateList();
      this.removePlateFromFirestore(placa);
    }
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

        querySnapshot.forEach((docSnap) => {
          deleteDoc(doc(platesCollection, docSnap.id))
            .then(() => {
              console.log(`Placa ${placa} eliminada exitosamente de Firestore.`);
            })
            .catch((error) => {
              console.error("Error al eliminar la placa: ", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error al buscar la placa en Firestore: ", error);
      });
  }

  // Update the list of plates in the parking lot
  updatePlateList(): void {
    const listaPlacasContenido = document.getElementById('listaPlacasContenido') as HTMLUListElement;
    listaPlacasContenido.innerHTML = '';
  
    for (const placa of Object.keys(this.placasOcupadas)) {
      const li = document.createElement('li');
      li.textContent = placa;
      listaPlacasContenido.appendChild(li);
    }
  }

  async fetchPlatesFromFirestore(): Promise<void> {
    try {
      const platesCollection = collection(db, 'placas');
      const querySnapshot = await getDocs(platesCollection);
  
      this.placasOcupadas = {};
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        this.placasOcupadas[data['placa']] = data['espacioId'];
      });
      this.configurarParqueadero();
      this.updatePlateList();
    } catch (error) {
      console.error("Error al recuperar las placas desde Firestore: ", error);
    }
  }
}
