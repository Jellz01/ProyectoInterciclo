import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { PersonasService, Persona } from '../../services/personas.service';
import { ContratosService, Contrato } from '../../services/contratos.service';
import { FormularioService, Usuario } from '../../services/formulario.service';
import { ConfiguracionParqueaderoService } from '../../services/configuracion-parqueadero.service';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgFor, FormsModule],
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {
  contratos: Contrato[] = [];
  cantidadEspacios: number = 0;
  espaciosArray: number[] = [];
  usuario: Usuario[] = [];  // Store personas for dropdown
  newContrato: Contrato = {
    clienteId: '',
    espacio: '',
    placa: '',
    fechaInicio: '',
    fechaFinal: '',
    total: ''
  };

  tarifaHora: number = 5;
  tarifaDia: number = 3;
  tarifaMes: number = 2;

  constructor(
    private contratosService: ContratosService,
    private formularioService: FormularioService,
    private configuraciones: ConfiguracionParqueaderoService
  ) { }

  ngOnInit(): void {
    this.loadContratos();
    this.loadPersonas(); 
    this.cantEspacios(); 
    this.loadConfiguraciones(); // Load configuration details
  }

  loadConfiguraciones() {
    this.configuraciones.getConfiguraciones().subscribe(data => {
      const configuraciones = data.configuraciones[0];
  
      this.tarifaHora = configuraciones.tarifa_hora;
      
      this.tarifaDia = configuraciones.tarifa_dia;
      this.tarifaMes = configuraciones.tarifa_mes;
      console.log("Dia: ",this.tarifaDia);
      console.log("Hora: ",this.tarifaHora);
      console.log("Monthly: ",this.tarifaMes);
    });
  }

  calculateTime(fechaInicio: string, fechaFin: string): number {
    // Convert fechaInicio and fechaFin to Date objects
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
  
    // Calculate the difference in milliseconds
    const diffInMillis = fechaFinDate.getTime() - fechaInicioDate.getTime();
    const diffInHours = diffInMillis / (1000 * 3600); // Convert milliseconds to hours
    const diffInDays = diffInHours / 24; // Convert hours to days
  
    // Log the calculation steps
    console.log("Fecha Inicio: ", fechaInicioDate);
    console.log("Fecha Final: ", fechaFinDate);
    console.log("Diferencia en milisegundos: ", diffInMillis);
    console.log("Diferencia en horas: ", diffInHours);
    console.log("Diferencia en días: ", diffInDays);
  
    // Calculate the total tariff based on the time difference
    let tarifa: number = 0;
    if (diffInHours < 24) {
      tarifa = this.tarifaHora * diffInHours; // For less than 24 hours, multiply by the hours
    } else if (diffInHours >= 24 && diffInHours < 730) {
      tarifa = this.tarifaDia * diffInDays; // For between 1 and 30 days (24h - 730h), multiply by the days
    } else if (diffInHours >= 730) {
      tarifa = this.tarifaMes * Math.ceil(diffInDays / 30); // For more than 30 days (730h), multiply by the months (rounded up)
    }
  
    // Log the final calculated tarifa
    console.log("Tarifa Calculada: ", tarifa);
  
    return tarifa;
  }
  
  

  cantEspacios() {
    this.configuraciones.getCantEspacios()
      .subscribe(
        (data1) => {
          this.cantidadEspacios = Number(data1);
          this.generarEspacios(); // Llamar a la función para actualizar el array
        },
        (error) => {
          console.error('Error Cargando cantidadEspacios: ', error);
        }
      );
  }

  generarEspacios() {
    this.espaciosArray = Array.from({ length: this.cantidadEspacios }, (_, i) => i + 1);
  }

  loadPersonas(): void {
    this.formularioService.getTodosLosUsuarios()
      .subscribe({
        next: (personas) => {
          this.usuario = personas;
        },
        error: (error) => {
          console.error('Error cargando usuarios:', error);
        }
      });
  }

  loadContratos(): void {
    this.contratosService.getContratos().subscribe(
      (data) => {
        this.contratos = data;
      },
      (error) => {
        console.error('Error fetching contratos', error);
      }
    );
  }

  addContrato(): void {
    // Calculate the total before adding the contract
    this.newContrato.total = this.calculateTime(this.newContrato.fechaInicio, this.newContrato.fechaFinal).toString();

    this.contratosService.createContrato(this.newContrato).subscribe(
      (response) => {
        this.contratos.push(response);
        this.resetForm();
      },
      (error) => {
        console.error('Error adding contrato', error);
      }
    );
  }

  resetForm(): void {
    this.newContrato = {
      clienteId: '',
      espacio: '',
      placa: '',
      fechaInicio: '',
      fechaFinal: '',
      total: ''
    };
  }
}
