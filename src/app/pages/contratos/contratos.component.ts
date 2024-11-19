import { Component } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { collection, getDocs, addDoc } from 'firebase/firestore'; // Corrected imports
import { firestore } from '../../firebase.config'; // Assuming this is correct import from your firebase.config
import { AuthService } from '../../firestore.config'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent {
  userForm: any;
  clientes: any[] = [];
  selectedCliente: string | null = null;

  // Add form for contract
  contratoForm: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Assuming userData is available in the context (perhaps from a service or directly from Firebase query)
    const userData = {
      fechIni: { seconds: 1680326400 },  // Example timestamp for 'fechIni'
      fechFin: { seconds: 1682918400 },  // Example timestamp for 'fechFin'
    };

    // New contract form
    this.contratoForm = this.fb.group({
      clienteId: ['', Validators.required],
      placaContrato: ['', Validators.required],
      inicioContrato: [
        new Date(userData['fechIni'].seconds * 1000).toISOString().substring(0, 10) || '', // Corrected ternary logic
        Validators.required
      ],
      finContrato: [
        new Date(userData['fechFin'].seconds * 1000).toISOString().substring(0, 10) || '', // Corrected ternary logic
        Validators.required
      ],
      estado: ['activo'] // default value
    });
  }

  ngOnInit(): void {
    this.getAllClientes();
  }

  // Retrieve clients from Firestore
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
  
      // Log each client's cedula
      this.clientes.forEach(cliente => {
        console.log("Cliente cedula:", cliente.cedula);
      });
  
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
    
    // Ensure the dates are valid
    const inicioContrato = this.convertToDate(this.contratoForm.value.inicioContrato);
    const finContrato = this.convertToDate(this.contratoForm.value.finContrato);
  
    if (!inicioContrato || !finContrato) {
      console.error("Invalid date values provided");
      return;  // Early exit if date conversion fails
    }
  
    const estado = this.contratoForm.value.estado;
  
    try {
      // Get the client's 'cedula' based on the selected 'clienteId'
     
     // Assuming 'cedula' is a field in the client data
  
      // Log the cedula
     
  
      // Use 'cedula' as the document ID for the new contract
      const contratosCollectionRef = collection(firestore, 'contratos');
  
      const newContractRef = await addDoc(contratosCollectionRef, {
        clienteId,
        placaContrato,
        inicioContrato,
        finContrato,
        estado
      });
  
      console.log("Contrato registrado correctamente con ID:", newContractRef.id);
    } catch (error) {
      console.error("Error registrando contrato:", error);
    }
  }
  
  
  // Helper method to convert the date input into a valid Date object
  convertToDate(dateValue: string): Date | null {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return null; // Invalid date
    }
    return date;
  }
}
