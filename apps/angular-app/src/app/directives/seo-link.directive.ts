import { Directive, ElementRef, Input, OnInit, Renderer2, HostListener, inject, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[seoLink]',
  standalone: true
})
export class SeoLinkDirective implements OnInit, OnChanges {
  @Input('seoLink') path!: string;
  @Input() seoLinkTarget?: string;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private router = inject(Router);
  private anchor!: HTMLAnchorElement;

  ngOnInit() {
    const parent = this.el.nativeElement.parentNode;
    this.anchor = this.renderer.createElement('a');
    
    // Set styles to prevent the anchor from breaking layout
    this.renderer.setStyle(this.anchor, 'display', 'contents');
    this.renderer.setStyle(this.anchor, 'text-decoration', 'none');
    this.renderer.setStyle(this.anchor, 'color', 'inherit');

    this.updateAnchorHref();
    if (this.seoLinkTarget) {
      this.renderer.setAttribute(this.anchor, 'target', this.seoLinkTarget);
    }

    // Insert anchor before host, then move host inside anchor
    this.renderer.insertBefore(parent, this.anchor, this.el.nativeElement);
    this.renderer.appendChild(this.anchor, this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['path'] && this.anchor) {
      this.updateAnchorHref();
    }
  }

  private updateAnchorHref() {
    // If the site uses a base href (e.g. for GitHub Pages), relative paths without leading slashes 
    // work best for the native href attribute so they resolve properly
    const href = this.path.startsWith('/') ? this.path.substring(1) : this.path;
    this.renderer.setAttribute(this.anchor, 'href', href);
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (!this.seoLinkTarget || this.seoLinkTarget === '_self') {
      event.preventDefault();
      event.stopPropagation();
      // Ensure the router uses the absolute path relative to Angular's router root
      const navigatePath = this.path.startsWith('/') ? this.path : '/' + this.path;
      this.router.navigateByUrl(navigatePath);
    }
  }
}
