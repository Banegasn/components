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
import { SearchBarComponent } from '../pages/search-bar/search-bar.component';
import { SplitButtonComponent } from '../pages/split-button/split-button.component';
import { LoadingIndicatorComponent } from '../pages/loading-indicator/loading-indicator.component';
import { FabMenuComponent } from '../pages/fab-menu/fab-menu.component';
import { MenuComponent } from '../pages/menu/menu.component';
import { QuickStartComponent } from '../pages/quick-start/quick-start.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'quick-start', component: QuickStartComponent },
    { path: 'components', component: ComponentsComponent },
    { path: 'buttons', component: ButtonComponent },
    { path: 'cards', component: CardsComponent },
    { path: 'navigation-rail', component: NavigationRailComponent },
    { path: 'navigation-bar', component: NavigationBarComponent },
    { path: 'switches', component: SwitchComponent },
    { path: 'radio-buttons', component: RadioButtonComponent },
    { path: 'search-bar', component: SearchBarComponent },
    { path: 'split-button', component: SplitButtonComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'loading-indicator', component: LoadingIndicatorComponent },
    { path: 'fab-menu', component: FabMenuComponent },
    { path: 'contact', component: ContactComponent },
];
