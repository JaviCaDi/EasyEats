import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { ListaPacksComponent } from './usuario/lista-packs/lista-packs.component';
import { DetallePackComponent } from './usuario/detalle-pack/detalle-pack.component';
import { ReservaComponent } from './usuario/reserva/reserva.component';
import { MisReservasComponent } from './usuario/mis-reservas/mis-reservas.component';
import { PerfilUsuarioComponent } from './usuario/perfil-usuario/perfil-usuario.component';
import { ValorarComponent } from './usuario/valorar/valorar.component';
import { QrComponent } from './usuario/qr/qr.component';

import { CrearPackComponent } from './negocio/crear-pack/crear-pack.component';
import { MisPacksComponent } from './negocio/mis-packs/mis-packs.component';
import { EditarPackComponent } from './negocio/editar-pack/editar-pack.component';
import { ReservasRecibidasComponent } from './negocio/reservas-recibidas/reservas-recibidas.component';
import { ValidarQrComponent } from './negocio/validar-qr/validar-qr.component';
import { EstadisticasNegocioComponent } from './negocio/estadisticas-negocio/estadisticas-negocio.component';
import { PerfilNegocioComponent } from './negocio/perfil-negocio/perfil-negocio.component';

import { PanelAdminComponent } from './admin/panel-admin/panel-admin.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { ReportesComponent } from './admin/reportes/reportes.component';
import { EstadisticasGeneralesComponent } from './admin/estadisticas-generales/estadisticas-generales.component';
import { ElegirRegistroComponent } from './auth/elegir-registro/elegir-registro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'packs', pathMatch: 'full' },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: ElegirRegistroComponent },
  { path: 'register/:tipo', component: RegisterComponent },

  // Usuario
  { path: 'packs', component: ListaPacksComponent },
  { path: 'packs/:id', component: DetallePackComponent },
  { path: 'reservar/:id', component: ReservaComponent },
  { path: 'mis-reservas', component: MisReservasComponent },
  { path: 'perfil', component: PerfilUsuarioComponent },
  { path: 'valorar/:id', component: ValorarComponent },
  { path: 'qr/:codigo', component: QrComponent },

  // Negocio
  { path: 'negocio/crear-pack', component: CrearPackComponent },
  { path: 'negocio/mis-packs', component: MisPacksComponent },
  { path: 'negocio/editar-pack/:id', component: EditarPackComponent },
  { path: 'negocio/reservas', component: ReservasRecibidasComponent },
  { path: 'negocio/validar-qr', component: ValidarQrComponent },
  { path: 'negocio/estadisticas', component: EstadisticasNegocioComponent },
  { path: 'negocio/perfil', component: PerfilNegocioComponent },

  // Admin (opcional)
  { path: 'admin', component: PanelAdminComponent },
  { path: 'admin/usuarios', component: UsuariosComponent },
  { path: 'admin/reportes', component: ReportesComponent },
  { path: 'admin/estadisticas', component: EstadisticasGeneralesComponent },

  // Fallback
  { path: '**', redirectTo: 'packs' },
];
