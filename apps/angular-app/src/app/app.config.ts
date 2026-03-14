import { ApplicationConfig, provideZonelessChangeDetection, Injectable } from '@angular/core';
import { provideRouter, withComponentInputBinding, TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

const DEFAULT_DESCRIPTION = 'A lightweight, multi-framework web components library implementing Google\'s Material 3 Expressive design system.';
const DEFAULT_TITLE = 'Material 3 Expressive - Web Components Library';

@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  constructor(
    private readonly title: Title,
    private readonly meta: Meta
  ) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    const fullTitle = title ? `Material 3 Expressive - ${title}` : DEFAULT_TITLE;

    this.title.setTitle(fullTitle);

    // Update SEO meta tags to match the title
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });

    // Traverse to the lowest level active route to get the custom data
    let currentRoute = routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const description = currentRoute.data['description'] || DEFAULT_DESCRIPTION;

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding()
    ),
    provideClientHydration(withEventReplay()),
    { provide: TitleStrategy, useClass: AppTitleStrategy }
  ]
};
