import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; // Add ReactiveFormsModule
import { Router } from '@angular/router';
import { collection, getDocs, setDoc, doc, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase.config';
import { AuthService } from '../../firestore.config'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Include ReactiveFormsModule
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent {
  userForm: any;
  clientes: any[] = [];
  selectedCliente: string | null = null;
  errorMessage: string | null = null;
  numeroP = localStorage.getItem('np');

  // Add form for contract
  contratoForm: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const userData = {
      fechIni: { seconds: 1680326400 }, 
      fechFin: { seconds: 1682918400 },
    };

    this.contratoForm = this.fb.group({
      clienteId: ['', Validators.required],
      placaContrato: ['', Validators.required],
      inicioContrato: [
        new Date(userData['fechIni'].seconds * 1000).toISOString().substring(0, 10) || '',
        Validators.required
      ],
      finContrato: [
        new Date(userData['fechFin'].seconds * 1000).toISOString().substring(0, 10) || '',
        Validators.required
      ],
      estado: ['activo'],
      espacioContrato: ['', Validators.required] // Agregar campo para 'espacioContrato' aquí
    });
  }

  ngOnInit(): void {
    this.getAllClientes();
  }

  getAllClientes(): Promise<any[]> {
    const clientesCollectionRef = collection(firestore, 'users');
    return getDocs(clientesCollectionRef).then((querySnapshot) => {
      let clientesList: any[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData['role'] === 'empleado') {
          clientesList.push({ id: doc.id, ...userData });
        }
      });
      this.clientes = clientesList;
      console.log("Retrieved users (empleados):", this.clientes);
      return clientesList;
    }).catch((error) => {
      console.error("Error fetching users (clientes):", error);
      return [];
    });
  }

  async registrarContrato() {
    console.log("Iniciando registro de contrato");

    const clienteId = this.contratoForm.value.clienteId;
    const placaContrato = this.contratoForm.value.placaContrato;
    const espacioContrato = this.contratoForm.value.espacioContrato; // Obtener valor de espacioContrato

    console.log("Cliente ID:", clienteId);
    console.log("Placa Contrato:", placaContrato);
    console.log("Espacio Contrato:", espacioContrato); // Mostrar el valor de espacioContrato en consola

    const inicioContrato = this.convertToDate(this.contratoForm.value.inicioContrato);
    const finContrato = this.convertToDate(this.contratoForm.value.finContrato);

    if (!inicioContrato || !finContrato) {
      console.error("Valores de fecha inválidos");
      return;
    }

    const estado = this.contratoForm.value.estado;

    // Obtener el valor de numeroP desde localStorage
    const numeroP = parseInt(localStorage.getItem('np') || '0', 10);

    // Verificar si espacioContrato es mayor que numeroP
    if (espacioContrato > numeroP) {
      this.errorMessage = "El espacio contratado no puede ser mayor que el número disponible.";
      console.error(this.errorMessage);
      return; // Exit if espacioContrato is greater than numeroP
    }

    try {
      const contratosCollectionRef = collection(firestore, 'contratos');

      // Verificar si ya existe un contrato con la misma placa
      const q = query(contratosCollectionRef, where("placaContrato", "==", placaContrato));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        this.errorMessage = "Ya existe un contrato con esa placa."; // Set error message
        console.error(this.errorMessage);
        return; // Exit if the contract with the same plate already exists
      }

      // Registrar el nuevo contrato
      const newContractRef = doc(contratosCollectionRef, placaContrato); // Usar placa como ID del documento
      await setDoc(newContractRef, {
        clienteId,
        placaContrato,
        inicioContrato,
        finContrato,
        estado,
        espacioContrato  // Incluir el nuevo campo
      });

      console.log("Contrato registrado correctamente con ID:", newContractRef.id);
      this.router.navigate(['pages/Main']);
    } catch (error) {
      console.error("Error registrando contrato:", error);
      this.errorMessage = "Error al registrar el contrato. Por favor, inténtelo nuevamente."; // Set a general error message
    }
}


  convertToDate(dateValue: string): Date | null {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return null; 
    }
    return date;
  }
}
