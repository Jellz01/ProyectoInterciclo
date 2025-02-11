import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { LcontratoServiceService } from '../../services/lcontrato-service.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-listar-contratos',
  standalone: true,
  imports: [DatePipe, CommonModule, NgFor, NgIf],
  templateUrl: './listar-contratos.component.html',
  styleUrls: ['./listar-contratos.component.scss']
})
export class ListarContratosComponent implements OnInit {
  contratos: any[] = [];
  

  constructor(private contratoService: LcontratoServiceService) {}

  ngOnInit(): void {
    this.getContratos();
  }

  eliminarContrato(contratoId: string): void {
    // Convierte el id a número, si es necesario
    const id = Number(contratoId);

    this.contratoService.deleteContrato(id).subscribe({
      next: (response) => {
        console.log('Contrato eliminado con éxito:', response);
        // Aquí puedes actualizar la lista de contratos eliminando el contrato
        this.contratos = this.contratos.filter(contrato => contrato.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar el contrato:', err);
      }
    });
  }


  getContratos(): void {
    this.contratoService.getContratos().subscribe(
      (data) => {
        console.log("Datos recibidos del backend:", data);
        this.contratos = data;
      },
      (error) => {
        console.error("Error al obtener contratos:", error);
      }
    );
  }
  
}
