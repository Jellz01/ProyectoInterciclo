import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MainComponent } from './pages/main/main.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ListarUsuariosComponent } from './pages/listar-usuarios/listar-usuarios.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import { EditarPerfilElegidoComponent } from './pages/editar-perfil-elegido/editar-perfil-elegido.component';
import { UsuarioEmComponent } from './pages/usuario-em/usuario-em.component';
import { ContratosComponent } from './pages/contratos/contratos.component';
import { ListarContratosComponent } from './pages/listar-contratos/listar-contratos.component';
import { ConfParqueoComponent } from './pages/conf-parqueo/conf-parqueo.component';
import { AuteComponent } from './pages/aute/aute.component';
import { CrearUsFComponent } from './pages/crear-us-f/crear-us-f.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { EmailComponent } from './pages/email/email.component';
import { EditarPerfilDespuesComponent } from './pages/editar-perfil-despues/editar-perfil-despues.component';



export const routes: Routes = [



    {
        path: '',
        component:AuteComponent
    },

    {
        path: 'pages/inicio',
        component: InicioComponent
    },
    {
        path: 'pages/Main',
        component: MainComponent
    },
    {
        path: 'pages/Perfil',
        component: PerfilComponent
    },
    {
        path: 'pages/listar',
        component: ListarUsuariosComponent
    },
    {
        path: 'pages/editar',
        component: EditarPerfilComponent
    },
    {
        path: 'pages/editarPerfilE',
        component: EditarPerfilElegidoComponent
    },
    {
        path: 'pages/editPerfilU',
        component: UsuarioEmComponent
    },
    {
        path: 'pages/contratos',
        component: ContratosComponent
    },
    {
        path: 'pages/listarCon',
        component: ListarContratosComponent
    },
    {
        path: 'pages/configParqueo',
        component: ConfParqueoComponent
    },
    {
        path: 'pages/crearUF',
        component: CrearUsFComponent
    },
    {
        path:'pages/historial',
        component: HistorialComponent
    },
    {
        path:'pages/email',
        component: EmailComponent
    },
    {
        path:'pages/editarPerfilD',
        component: EditarPerfilDespuesComponent
    }

];
