import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home.component';
import { ComponentsComponent } from '../pages/components.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'components', component: ComponentsComponent },
];
