import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase.config';
import { AuthService } from '../../firestore.config';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-listar-contratos',
  standalone: true,
  imports: [DatePipe,CommonModule,NgFor,NgIf],
  templateUrl: './listar-contratos.component.html',
  styleUrl: './listar-contratos.component.scss'
})
export class ListarContratosComponent {
  
  contratos: any[] = [];
  contratoForm: any;
  emailU: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.contratoForm = this.fb.group({
      nombreCliente: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      monto: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      placa: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllContratos(); // Fetch all contracts
    

    if (this.emailU) {
      this.getContratoByEmail(this.emailU).then(contrato => {
        if (contrato) {
          console.log("Retrieved contract data:", contrato);

          // Patch form with retrieved contract data
          this.contratoForm.patchValue({
            nombreCliente: contrato.nombreCliente,
            fechaInicio: contrato.fechaInicio ? new Date(contrato.fechaInicio.seconds * 1000).toISOString().substring(0, 10) : '',
            fechaFinal: contrato.fechaFinal ? new Date(contrato.fechaFinal.seconds * 1000).toISOString().substring(0, 10) : '',
            monto: contrato.monto,
            placa: contrato.placa
          });
        }
      }).catch(error => console.error('Error fetching contract data:', error));
    } else {
      console.warn("No email found for contract.");
    }
  }

  getAllContratos(): Promise<any[]> {
    const contratosCollectionRef = collection(firestore, 'contratos'); // Changed to 'contratos'
    return getDocs(contratosCollectionRef).then((querySnapshot) => {
      let contratosList: any[] = [];
      querySnapshot.forEach((doc) => {
        contratosList.push(doc.data());
      });
      this.contratos = contratosList;  // Make sure the data is assigned to contratos array
      return contratosList;
    });
  }

  getContratoByEmail(emailU: string): Promise<any> {
    const contratosCollectionRef = collection(firestore, 'contratos');
    const q = query(contratosCollectionRef, where('email', '==', emailU)); // Filter by email
    return getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('No contract found with that email.');
        return null; // Return null if no contract is found
      } else {
        const contrato = querySnapshot.docs[0].data(); // Get the first matching contract
        return contrato;
      }
    }).catch(error => {
      console.error('Error fetching contract by email: ', error);
      return null; // Handle errors
    });
  }

  editContrato(email: string): void {
    this.getContratoByEmail(email).then(contrato => {
      if (contrato) {
        console.log("Email for editing: ", email);
       
        
        // Navigate to the edit contract page and pass the contract data
        this.router.navigate(['pages/editarContrato'], { 
          state: { contratoData: contrato }  // Pass contract data as state
        });
      } else {
        console.log('Contract not found.');
      }
    }).catch(error => console.error('Error editing contract:', error));
  }

  deleteContrato(email: string): void {
    console.log("Email: ", email);
    console.log('Deleting contract:', email);

    // Fetch the contract by email to get the contract document reference
    const contratosCollectionRef = collection(firestore, 'contratos');
    const q = query(contratosCollectionRef, where('email', '==', email));

    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('No contract found with that email.');
      } else {
        const contratoDocRef = doc(firestore, 'contratos', querySnapshot.docs[0].id);  // Get the document reference

        // Delete the contract document
        deleteDoc(contratoDocRef)
          .then(() => {
            console.log(`Contract with email ${email} deleted successfully.`);
            this.getAllContratos();  // Refresh the list of contracts
          })
          .catch((error) => {
            console.error('Error deleting contract:', error);
          });
      }
    }).catch(error => {
      console.error('Error fetching contract by email for deletion:', error);
    });
  }
}
