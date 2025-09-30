import { Routes } from '@angular/router';
import { PersonaListComponent } from './features/pages/persona-list/persona-list.component';
import { ProductListComponent } from './features/pages/product-list/product-list.component';
import { AcercadeComponent } from './features/pages/acercade/acercade.component';
import { UsuarioListComponent } from './features/pages/usuario-list/usuario-list.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    canActivate: [AuthGuard],
    children: [
      { path: 'personas', component: PersonaListComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'acercade', component: AcercadeComponent },
      { path: 'usuarios', component: UsuarioListComponent },
      { path: '', redirectTo: '/personas', pathMatch: 'full' } // Redirige a personas después del login
    ]
  },
  { path: '**', redirectTo: '/login' } // Cualquier ruta desconocida va al login
];