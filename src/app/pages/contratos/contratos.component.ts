import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; // Add ReactiveFormsModule
import { Router } from '@angular/router';
import { collection, getDocs, addDoc } from 'firebase/firestore';
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
      estado: ['activo']
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
  
    console.log("Cliente ID:", clienteId);
    console.log("Placa Contrato:", placaContrato);
  
    const inicioContrato = this.convertToDate(this.contratoForm.value.inicioContrato);
    const finContrato = this.convertToDate(this.contratoForm.value.finContrato);
  
    if (!inicioContrato || !finContrato) {
      console.error("Invalid date values provided");
      return;
    }
  
    const estado = this.contratoForm.value.estado;
  
    try {
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

  convertToDate(dateValue: string): Date | null {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return null; 
    }
    return date;
  }
}
