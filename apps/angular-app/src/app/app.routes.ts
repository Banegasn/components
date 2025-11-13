import { Routes } from '@angular/router';
import { ButtonComponent } from '../pages/buttons/button.component';
import { CardsComponent } from '../pages/cards/cards.component';
import { ComponentsComponent } from '../pages/components/components.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { HomeComponent } from '../pages/home/home.component';
import { NavigationRailComponent } from '../pages/navigation-rail/navigation-rail.component';
import { NavigationBarComponent } from '../pages/navigation-bar/navigation-bar.component';
import { SwitchComponent } from '../pages/switches/switch.component';
import { RadioButtonComponent } from '../pages/radio-buttons/radio-button.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'components', component: ComponentsComponent },
    { path: 'buttons', component: ButtonComponent },
    { path: 'cards', component: CardsComponent },
    { path: 'navigation-rail', component: NavigationRailComponent },
    { path: 'navigation-bar', component: NavigationBarComponent },
    { path: 'switches', component: SwitchComponent },
    { path: 'radio-buttons', component: RadioButtonComponent },
    { path: 'contact', component: ContactComponent },
];
