import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ConfiguracionParqueaderoService } from "../../services/configuracion-parqueadero.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { IngresoPlacasService } from "../../services/ingreso-placas.service";
import { EspaciosService } from "../../services/espacios.service";
import { HistorialService } from "../../services/historial.service";

// Define the structure of the Espacio object
interface Espacio {
  id: number;
  espacio: string;
  placa: string;
  fechaHoraIngreso:string;
  fechaHoraSalida?: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  horaApertura: string = '08:00';
  horaCierre: string = '20:00';
  fechaHoraIngreso: string='';
  fechaHoraSalida:string='';
  numeroParqueos: number = 10;
  tarifas: { hora: number; dia: number; mes: number } = { hora: 0, dia: 0, mes: 0 };
  diasApertura: string[] = [];
  placasEnParqueadero: string[] = [];
  placaIngreso: string = '';
  placaSalida: string = '';
  espaciosDisponibles: Espacio[] = [];
  espaciosUsados: Espacio[] = [];
  espacioSeleccionado: string = '';

  constructor(
    private router: Router,
    private configuracionesS: ConfiguracionParqueaderoService,
    private ingresoPService: IngresoPlacasService,
    private espaciosService: EspaciosService,
    private historialService: HistorialService
  ) {}

  ngOnInit(): void {
    console.log("ngOnInit called");
    this.cargarDatosIniciales();
    this.getEspacios();
  }


  calculateTariff(fechaHoraIngreso: string, fechaHoraSalida: string): number {
    // Convert the fechaHoraIngreso and fechaHoraSalida to Date objects
    const ingreso = new Date(fechaHoraIngreso);
    const salida = new Date(fechaHoraSalida);
    
    console.log('Fecha de ingreso:', ingreso);
    console.log('Fecha de salida:', salida);
  
    // Ensure that the salida date is after the ingreso date
    if (salida <= ingreso) {
      alert('La hora de salida debe ser posterior a la hora de ingreso.');
      console.log('La hora de salida no es posterior a la hora de ingreso.');
      return 0;
    }
  
    // Calculate the time difference in milliseconds
    const diffTime = salida.getTime() - ingreso.getTime();
    console.log('Diferencia de tiempo en milisegundos:', diffTime);
  
    // Convert time difference from milliseconds to hours
    const diffHours = diffTime / (1000 * 3600);
    console.log('Diferencia de tiempo en horas:', diffHours);
  
    let totalTariff: number;
  
    // Determine the correct tariff based on the time difference
    if (diffHours < 24) {
      // Apply hourly tariff
      totalTariff = this.tarifas.hora * diffHours;
      console.log('Tarifa por hora:', this.tarifas.hora, 'Total:', totalTariff);
    } else if (diffHours >= 24 && diffHours < 730) {
      // Apply daily tariff
      const diffDays = diffHours / 24;
      totalTariff = this.tarifas.dia * diffDays;
      console.log('Diferencia de tiempo en días:', diffDays);
      console.log('Tarifa diaria:', this.tarifas.dia, 'Total:', totalTariff);
    } else {
      // Apply monthly tariff
      const diffMonths = diffHours / 730;
      totalTariff = this.tarifas.mes * diffMonths;
      console.log('Diferencia de tiempo en meses:', diffMonths);
      console.log('Tarifa mensual:', this.tarifas.mes, 'Total:', totalTariff);
    }
  
    // Return the calculated tariff
    console.log('Tarifa total calculada:', totalTariff);
    return totalTariff;
  }
  
  
  

  gestionarParqueadero(): void {
    console.log("Navigating to parqueo management");
    this.router.navigate(['pages/configParqueo']);
  }

  listarUsuarios(): void {
    console.log("Navigating to user listing");
    this.router.navigate(['pages/listar']);
  }

  emailM(){
    this.router.navigate(['pages/email']);

  }
  configuraciones(){
    this.router.navigate(['pages/configParqueo'])
  }

  historial(){
    this.router.navigate(['pages/historial'])
  }

  listarContratos(): void {
    console.log("Navigating to contracts listing");
    this.router.navigate(['pages/listarCon']);
  }

  gestionarContrato(): void {
    console.log("Navigating to contract management");
    this.router.navigate(['/pages/contratos']);
  }

  editarPerfil(): void {
    console.log("Navigating to profile editing");
    this.router.navigate(['pages/editarPerfilD']);
    // Log the stored email from localStorage
  const storedEmail = localStorage.getItem('editarEmail');
  console.log('Stored email in localStorage:', storedEmail);

  }

  cargarDatosIniciales() {
  this.configuracionesS.getConfiguraciones().subscribe({
    next: (data) => {
      console.log('Datos de configuraciones:', data);
      if (data && data.configuraciones && data.configuraciones.length > 0) {
        const config = data.configuraciones[0];
        this.horaApertura = config.hora_apertura;
        this.horaCierre = config.hora_cierre;
        this.numeroParqueos = +config.cant_espacios;  // Convert to number
        this.tarifas.hora = +config.tarifa_hora;
        this.tarifas.dia = +config.tarifa_dia;
        this.tarifas.mes = +config.tarifa_mes;

        // Dynamically generate the available spaces
        this.espaciosDisponibles = Array.from({ length: this.numeroParqueos }, (_, index) => ({
          id: index + 1,
          espacio: `Espacio-${index + 1}`,
          placa: '',
          fechaHoraIngreso: ''
        }));
      }
    },
    error: (err) => console.error('Error al cargar los datos iniciales', err)
  });

  // Fetch parking spaces
  this.ingresoPService.getEspacios().subscribe({
    next: (data) => {
      this.actualizarEspaciosDisponibles();
      console.log('Espacios disponibles:', this.espaciosDisponibles);
    },
    error: (err) => console.error('Error al cargar los espacios', err)
  });
}

  

  actualizarEspaciosDisponibles() {
    this.espaciosDisponibles = [];

    for (let i = 1; i <= this.numeroParqueos; i++) {
      const espacio = `Espacio-${i}`;
      const espacioUsado = this.espaciosUsados.find(e => e.espacio === espacio);

      if (espacioUsado) {
        this.espaciosDisponibles.push({
          id: i,
          espacio: espacioUsado.espacio,
          placa: espacioUsado.placa,
          fechaHoraIngreso: espacioUsado.fechaHoraIngreso
        });
      } else {
        this.espaciosDisponibles.push({ id: i, espacio, placa: '', fechaHoraIngreso: '' });
      }
    }
  }

  ocuparEspacio() {
  if (this.placaIngreso && this.espacioSeleccionado) {
    const nuevoEspacio: Espacio = { 
      id: +this.espacioSeleccionado.split('-')[1], 
      espacio: this.espacioSeleccionado, 
      placa: this.placaIngreso, 
      fechaHoraIngreso: this.fechaHoraIngreso // Agregamos la propiedad
  };
  

    console.log('Hola: ', nuevoEspacio);

    // Crear objeto para historial SIN ID
    const historialData = { 
      espacio: nuevoEspacio.espacio, 
      placa: nuevoEspacio.placa, 
      fechaHoraIngreso: this.fechaHoraIngreso 
  };
  

    // Primero, guardar en historial (sin ID)
    this.historialService.guardarHistorial(historialData).subscribe({
      next: () => {
        console.log("Historial guardado correctamente.");

        // Luego, guardar en espacios
        this.ingresoPService.createEspacio(nuevoEspacio).subscribe({
          next: () => {
            console.log(`${this.placaIngreso} ha ingresado al parqueadero en ${this.espacioSeleccionado}.`);

            this.placasEnParqueadero.push(`${this.espacioSeleccionado} - ${this.placaIngreso}`);

            this.placaIngreso = '';
            this.espacioSeleccionado = '';
            this.actualizarEspaciosDisponibles();
          },
          error: (err) => console.error('Error al registrar el espacio', err)
        });
      },
      error: (err) => console.error("Error al guardar en historial", err)
    });

  } else {
    console.log('Debe ingresar una placa válida y seleccionar un espacio disponible.');
  }
}

salirEspacio(placa: string, fechaHoraSalida: string) {
  try {
      // Validación: Asegurarse de que la fechaHoraSalida esté definida
      if (!fechaHoraSalida) {
          alert('Por favor, ingrese la hora de salida.');
          return;
      }

      // Buscar el espacio con la placa correspondiente
      const espacio = this.espaciosUsados.find(e => e.placa === placa);

      if (!espacio) {
          alert('Espacio no encontrado.');
          return;
      }

      // Validar que la fechaHoraSalida sea posterior a la fechaHoraIngreso
      const ingreso = new Date(espacio.fechaHoraIngreso);
      const salida = new Date(fechaHoraSalida);

      if (salida <= ingreso) {
          alert('La hora de salida debe ser posterior a la hora de ingreso.');
          return;
      }

      // Calcular el costo del parqueo
      const totalCost = this.calculateTariff(espacio.fechaHoraIngreso, fechaHoraSalida);
      console.log(`Costo del parqueo para placa ${placa}: ${totalCost}`);

      // Proceder con la salida
      console.log(`Espacio con placa ${placa} ha salido a las ${fechaHoraSalida}`);

      // Eliminar el espacio de la lista
      this.espaciosUsados = this.espaciosUsados.filter(espacio => espacio.placa !== placa);

      // Llamada al servicio para eliminar el espacio
      this.espaciosService.deleteByPlaca(placa);

      // Confirmación al usuario
      alert(`El vehículo con placa ${placa} ha sido registrado como salido. Costo: ${totalCost}`);
  } catch (error) {
      console.error("Error al procesar la salida:", error);
      alert('Hubo un error al procesar la salida del vehículo. Por favor, intente nuevamente.');
  }
}



  

  eliminarPlaca(id: number) {
    const espacioToDelete = this.espaciosDisponibles.find(espacio => espacio.id === id);

    if (espacioToDelete) {
      this.ingresoPService.deleteEspacio(espacioToDelete).subscribe({
        next: () => {
          console.log(`Espacio con ID ${id} eliminado correctamente.`);

          this.placasEnParqueadero = this.placasEnParqueadero.filter(p => !p.includes(`Espacio-${id}`));

          this.actualizarEspaciosDisponibles();
        },
        error: (err) => console.error('Error al eliminar el espacio', err)
      });
    } else {
      console.log('Espacio no encontrado.');
    }
  }

  getEspacios() {
    this.espaciosService.getEspacios().subscribe({
      next: (data1) => {
        console.log("Datos de espacios recibidos:", data1);
        this.espaciosUsados = data1; // Store data in espaciosUsados
      },
      error: (err) => console.error("Error al obtener los espacios:", err),
    });
    
  }
}
