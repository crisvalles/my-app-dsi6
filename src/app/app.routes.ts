import { Routes } from '@angular/router';
import { PersonaListComponent } from './features/pages/persona-list/persona-list.component';
import { ProductListComponent } from './features/pages/product-list/product-list.component';

export const routes: Routes = [
  {path: 'personas', component: PersonaListComponent},
  { path: 'products', component: ProductListComponent }
];