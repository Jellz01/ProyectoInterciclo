import { Component } from '@angular/core';
import { HistorialService } from '../../services/historial.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']  // Corrección aquí
})
export class HistorialComponent {
  historial: any[] = []; // Variable para almacenar los datos originales
  filteredHistorial: any[] = []; // Variable para almacenar los datos filtrados
  selectedMonth: string = ''; // Variable para almacenar el mes seleccionado
  selectedDay: string = ''; // Variable para almacenar el día seleccionado
  selectedWeek: string = ''; // Variable para almacenar la semana seleccionada
  selectedYear: string = ''; // Variable para almacenar el año seleccionado

  // Opciones de filtros
  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
  years: string[] = []; // Opciones de años (del 2000 al 2040)

  constructor(private historialService: HistorialService) {}

  ngOnInit() {
    // Generar los años desde el 2000 hasta el 2040
    this.years = Array.from({ length: 2040 - 2000 + 1 }, (_, index) => (2000 + index).toString());
  }

  // Función para obtener el historial de la base de datos
  getHistorial() {
    this.historialService.getEspacios().subscribe({
      next: (data) => {
        this.historial = data; // Guarda los datos recibidos en la variable
        this.filteredHistorial = [...this.historial]; // Inicializa los datos filtrados
        console.log('Historial cargado:', this.historial);
      },
      error: (err) => {
        console.error('Error al obtener historial:', err);
      }
    });
  }

  // Función para aplicar los filtros seleccionados
  filterHistorial() {
    this.filteredHistorial = this.historial.filter(item => {
      let include = true;

      // Filtrar por mes
      if (this.selectedMonth && !this.itemMatchesMonth(item)) {
        include = false;
      }

      // Filtrar por día
      if (this.selectedDay && !this.itemMatchesDay(item)) {
        include = false;
      }

      // Filtrar por semana
      if (this.selectedWeek && !this.itemMatchesWeek(item)) {
        include = false;
      }

      // Filtrar por año
      if (this.selectedYear && !this.itemMatchesYear(item)) {
        include = false;
      }

      return include;
    });
  }

  // Función para verificar si el item corresponde al mes seleccionado
  itemMatchesMonth(item: any): boolean {
    const itemMonth = new Date(item.fechaHoraIngreso).toLocaleString('default', { month: 'long' });
    return itemMonth.toLowerCase() === this.selectedMonth.toLowerCase();
  }

  // Función para verificar si el item corresponde al día seleccionado
  itemMatchesDay(item: any): boolean {
    const itemDay = new Date(item.fechaHoraIngreso).toLocaleString('default', { weekday: 'long' });
    return itemDay.toLowerCase() === this.selectedDay.toLowerCase();
  }

  // Función para verificar si el item corresponde a la semana seleccionada
  itemMatchesWeek(item: any): boolean {
    const itemDate = new Date(item.fechaHoraIngreso);
    const startOfYear = new Date(itemDate.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((itemDate.getTime() - startOfYear.getTime()) / 86400000) + 1) / 7);
    const selectedWeekNumber = parseInt(this.selectedWeek.split(' ')[1], 10);

    return weekNumber === selectedWeekNumber;
  }

  // Función para verificar si el item corresponde al año seleccionado
  itemMatchesYear(item: any): boolean {
    const itemYear = new Date(item.fechaHoraIngreso).getFullYear().toString();
    return itemYear === this.selectedYear;
  }
}
