import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionParqueaderoService } from '../../services/configuracion-parqueadero.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conf-parqueo',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule], // Use CommonModule here
  templateUrl: './conf-parqueo.component.html',
  styleUrls: ['./conf-parqueo.component.scss'],
})
export class ConfParqueoComponent implements OnInit {
  formulario = {
    hora_apertura: '',
    hora_cierre: '',
    cant_espacios: '',
    tarifa_hora: '',
    tarifa_dia: '',
    tarifa_mes: '',
    dias_disponibles: { // Campos para días seleccionados
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
      sabado: false,
      domingo: false
    },
    fechas_disponibles: [] // O un array para fechas específicas
  };

  constructor(private configuracionesService: ConfiguracionParqueaderoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  onSubmit() {
    const formularioToSubmit = {
      hora_apertura: this.formulario.hora_apertura,
      hora_cierre: this.formulario.hora_cierre,
      cant_espacios: this.formulario.cant_espacios,
      tarifa_hora: this.formulario.tarifa_hora,
      tarifa_dia: this.formulario.tarifa_dia,
      tarifa_mes: this.formulario.tarifa_mes,
      dias_disponibles: this.formulario.dias_disponibles,
      fechas_disponibles: this.formulario.fechas_disponibles
    };

    console.log('Formulario a enviar: ', formularioToSubmit);

    this.configuracionesService.updateConfiguracion(formularioToSubmit)
      .subscribe({
        next: response => {
          console.log('Formulario actualizado correctamente: ', response);
          this.resetForm();
          this.router.navigate(["/pages/Main"]);
        },
        error: err => console.error('Error al actualizar el formulario', err)
      });
  }

  cargarDatosIniciales() {
    this.configuracionesService.getConfiguraciones().subscribe({
      next: (data) => {
        if (data && data.configuraciones && data.configuraciones.length > 0) {
          const config = data.configuraciones[0];
          this.formulario.hora_apertura = config.hora_apertura;
          this.formulario.hora_cierre = config.hora_cierre;
          this.formulario.cant_espacios = config.cant_espacios;
          this.formulario.tarifa_hora = config.tarifa_hora;
          this.formulario.tarifa_dia = config.tarifa_dia;
          this.formulario.tarifa_mes = config.tarifa_mes;
        }
      },
      error: (err) => console.error('Error al cargar los datos iniciales', err)
    });
  }

  resetForm() {
    this.formulario = {
      hora_apertura: '',
      hora_cierre: '',
      cant_espacios: '',
      tarifa_hora: '',
      tarifa_dia: '',
      tarifa_mes: '',
      dias_disponibles: {
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false
      },
      fechas_disponibles: []
    };
  }
}
