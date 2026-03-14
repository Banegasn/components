import { Component, Input, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seo-link',
  standalone: true,
  template: `
    <a [href]="processedHref" [target]="target || '_self'" (click)="onClick($event)">
      <ng-content></ng-content>
    </a>
  `,
  styles: [`
    :host {
      display: contents;
    }
    a {
      display: contents;
      text-decoration: none;
      color: inherit;
    }
  `]
})
export class SeoLinkComponent {
  @Input() href!: string;
  @Input() target?: string;

  private router = inject(Router);

  get processedHref() {
    if (!this.href) return '';
    return this.href.startsWith('/') ? this.href.substring(1) : this.href;
  }

  onClick(event: Event) {
    if (!this.target || this.target === '_self') {
      event.preventDefault();
      event.stopPropagation();
      const navigatePath = this.href.startsWith('/') ? this.href : '/' + this.href;
      this.router.navigateByUrl(navigatePath);
    }
  }
}
