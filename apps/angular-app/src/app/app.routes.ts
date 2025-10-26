import { Routes } from '@angular/router';
import { ButtonComponent } from '../pages/buttons/button.component';
import { CardsComponent } from '../pages/cards/cards.component';
import { ComponentsComponent } from '../pages/components/components.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { HomeComponent } from '../pages/home/home.component';
import { NavigationRailComponent } from '../pages/navigation-rail/navigation-rail.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'components', component: ComponentsComponent },
    { path: 'buttons', component: ButtonComponent },
    { path: 'cards', component: CardsComponent },
    { path: 'navigation-rail', component: NavigationRailComponent },
    { path: 'contact', component: ContactComponent },
];
