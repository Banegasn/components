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
import { CheckboxComponent } from '../pages/checkbox/checkbox.component';
import { SliderComponent } from '../pages/slider/slider.component';
import { TextFieldComponent } from '../pages/text-field/text-field.component';
import { DialogComponent } from '../pages/dialog/dialog.component';
import { ChipsComponent } from '../pages/chips/chips.component';
import { TooltipComponent } from '../pages/tooltip/tooltip.component';
import { BadgeComponent } from '../pages/badge/badge.component';
import { ProgressComponent } from '../pages/progress/progress.component';
import { TabsComponent } from '../pages/tabs/tabs.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'quick-start',
        component: QuickStartComponent,
        title: 'Quick Start',
        data: {
            description: 'Learn how to quickly install and integrate the Material 3 Expressive web components into your Angular, React, Vue, or Vanilla JS project.'
        }
    },
    {
        path: 'components',
        component: ComponentsComponent,
        title: 'Components',
        data: {
            description: 'Browse the complete collection of Material 3 Expressive web components available for your web applications.'
        }
    },
    {
        path: 'buttons',
        component: ButtonComponent,
        title: 'Buttons',
        data: {
            description: 'Material 3 Expressive Button components, including elevated, filled, tonal, outlined, and text variants.'
        }
    },
    {
        path: 'cards',
        component: CardsComponent,
        title: 'Cards',
        data: {
            description: 'Material 3 Expressive Card components for grouping related content and actions.'
        }
    },
    {
        path: 'navigation-rail',
        component: NavigationRailComponent,
        title: 'Navigation Rail',
        data: {
            description: 'Material 3 Expressive Navigation Rail component for ergonomic side navigation.'
        }
    },
    {
        path: 'navigation-bar',
        component: NavigationBarComponent,
        title: 'Navigation Bar',
        data: {
            description: 'Material 3 Expressive Navigation Bar component for bottom navigation on mobile devices.'
        }
    },
    {
        path: 'switches',
        component: SwitchComponent,
        title: 'Switches',
        data: {
            description: 'Material 3 Expressive Switch components for toggling the state of a single setting.'
        }
    },
    {
        path: 'radio-buttons',
        component: RadioButtonComponent,
        title: 'Radio Buttons',
        data: {
            description: 'Material 3 Expressive Radio Button components for selecting a single option from a list.'
        }
    },
    {
        path: 'checkboxes',
        component: CheckboxComponent,
        title: 'Checkboxes',
        data: {
            description: 'Material 3 Expressive Checkbox components for selecting multiple options.'
        }
    },
    {
        path: 'sliders',
        component: SliderComponent,
        title: 'Sliders',
        data: {
            description: 'Material 3 Expressive Slider components for selecting from a range of values.'
        }
    },
    {
        path: 'text-fields',
        component: TextFieldComponent,
        title: 'Text Fields',
        data: {
            description: 'Material 3 Expressive Text Field components for entering text.'
        }
    },
    {
        path: 'chips',
        component: ChipsComponent,
        title: 'Chips',
        data: {
            description: 'Material 3 Expressive Chip components for entering information, making selections, filtering content, or triggering actions.'
        }
    },
    {
        path: 'dialog',
        component: DialogComponent,
        title: 'Dialog',
        data: {
            description: 'Material 3 Expressive Dialog component for important prompts in a user flow.'
        }
    },
    {
        path: 'tooltip',
        component: TooltipComponent,
        title: 'Tooltip',
        data: {
            description: 'Material 3 Expressive Tooltip component for informative text on hover or focus.'
        }
    },
    {
        path: 'badge',
        component: BadgeComponent,
        title: 'Badge',
        data: {
            description: 'Material 3 Expressive Badge component for conveying dynamic information like counts or status.'
        }
    },
    {
        path: 'progress',
        component: ProgressComponent,
        title: 'Progress Indicator',
        data: {
            description: 'Material 3 Expressive Linear Progress Indicator for displaying operation status.'
        }
    },
    {
        path: 'tabs',
        component: TabsComponent,
        title: 'Tabs',
        data: {
            description: 'Material 3 Expressive Tabs component for organizing content across screens.'
        }
    },
    {
        path: 'search-bar',
        component: SearchBarComponent,
        title: 'Search Bar',
        data: {
            description: 'Material 3 Expressive Search Bar component for global or local searching.'
        }
    },
    {
        path: 'split-button',
        component: SplitButtonComponent,
        title: 'Split Button',
        data: {
            description: 'Material 3 Expressive Split Button component for dual-action interactions.'
        }
    },
    {
        path: 'menu',
        component: MenuComponent,
        title: 'Menu',
        data: {
            description: 'Material 3 Expressive Menu component for displaying a list of choices on a temporary surface.'
        }
    },
    {
        path: 'loading-indicator',
        component: LoadingIndicatorComponent,
        title: 'Loading Indicator',
        data: {
            description: 'Material 3 Expressive Loading Indicator components to show background activity.'
        }
    },
    {
        path: 'fab-menu',
        component: FabMenuComponent,
        title: 'FAB Menu',
        data: {
            description: 'Material 3 Expressive Floating Action Button (FAB) Menu component for primary actions.'
        }
    },
    {
        path: 'contact',
        component: ContactComponent,
        title: 'Contact',
        data: {
            description: 'Get in touch or find more information about the Material 3 Expressive library creator.'
        }
    },
];
