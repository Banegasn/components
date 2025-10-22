import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home.component';
import { ComponentsComponent } from '../pages/components.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'components', component: ComponentsComponent },
];
