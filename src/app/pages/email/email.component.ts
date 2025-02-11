import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { FormularioService } from '../../services/formulario.service';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent {
  recipient: string = '';
  subject: string = '';
  message: string = '';
  users: string[] = [];  // Store the list of emails (strings)

  constructor(
    private emailService: EmailService,
    private formulario: FormularioService
  ) {}

  getPersonas() {
    this.formulario.getTodosLosUsuarios().subscribe(
      (usuarios) => {
        console.log('Usuarios obtenidos:', usuarios);
        // Map the usuarios array to extract email addresses
        this.users = usuarios.map((usuario: any) => usuario.email); // Assuming `email` is the property
        this.sendEmailToAll();  // Send email to all users
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  sendEmailToAll() {
    // Loop through each user and send the email
    this.users.forEach((user) => {
      const emailData = {
        recipient: user,
        subject: this.subject,
        message: this.message,
      };

      this.emailService.sendEmail(emailData).subscribe(
        (response) => {
          console.log(`Correo enviado con éxito a ${user}:`, response);
        },
        (error) => {
          console.error(`Error al enviar correo a ${user}:`, error);
        }
      );
    });
  }

  sendEmail(): void {
    const emailData = {
      recipient: this.recipient,
      subject: this.subject,
      message: this.message,
    };

    this.emailService.sendEmail(emailData).subscribe(
      (response) => {
        console.log('Correo enviado con éxito:', response);
      },
      (error) => {
        console.error('Error al enviar correo:', error);
      }
    );
  }
}
