import { Component, OnInit } from '@angular/core';
import { collection, getDocs,deleteDoc,doc } from 'firebase/firestore'; // Import Firestore methods
import { firestore } from '../../firebase.config'; // Your Firestore configuration
import { CommonModule, DatePipe } from '@angular/common'; // CommonModule and DatePipe for handling dates
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-listar-contratos',
  standalone: true,
  imports: [DatePipe, CommonModule, NgFor, NgIf],
  templateUrl: './listar-contratos.component.html',
  styleUrls: ['./listar-contratos.component.scss']
})
export class ListarContratosComponent implements OnInit {
  contratos: any[] = []; // Array to store contratos
  loading: boolean = true; // Flag to handle loading state

  constructor() {}

  ngOnInit(): void {
    this.fetchContratos(); // Fetch contratos when component initializes
  }

  // Fetch contratos from Firestore
  fetchContratos(): void {
    const contratosCollectionRef = collection(firestore, 'contratos'); // Reference to 'contratos' collection

    // Fetch documents from Firestore
    getDocs(contratosCollectionRef)
      .then((querySnapshot) => {
        this.contratos = []; // Clear the contratos array before adding new data

        querySnapshot.forEach((doc) => {
          const contratoData = doc.data();
          const contrato = {
            id: doc.id, // Document ID
            nombreCliente: contratoData['clienteId'], // Use bracket notation for dynamic property access
            fechaInicio: contratoData['inicioContrato'].toDate(), // Convert Firestore Timestamp to Date object
            fechaFinal: contratoData['finContrato'].toDate(), // Convert Firestore Timestamp to Date object
            placa: contratoData['placaContrato'], // Use bracket notation for dynamic property access
          };
          this.contratos.push(contrato); // Push each contrato to the contratos array
        });

        this.loading = false; // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching contratos:", error);
        this.loading = false; // Set loading to false if an error occurs
      });
  }


    // Método para borrar contrato
    borrarContrato(contratoId: string): void {
      const contratoDocRef = doc(firestore, 'contratos', contratoId); // Referencia al documento del contrato usando su ID
  
      // Eliminar el contrato de Firestore
      deleteDoc(contratoDocRef)
        .then(() => {
          console.log("Contrato eliminado correctamente");
          this.fetchContratos(); // Recargar la lista de contratos después de eliminar
        })
        .catch((error) => {
          console.error("Error al eliminar el contrato:", error);
        });
    }
  }

  
