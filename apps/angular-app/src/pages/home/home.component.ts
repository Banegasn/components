import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: []
})
export class HomeComponent {
  constructor(private router: Router) { }

  navigateToComponents() {
    this.router.navigate(['/components']);
  }

  navigateToNavigationRail() {
    this.router.navigate(['/navigation-rail']);
  }

  navigateToButtons() {
    this.router.navigate(['/buttons']);
  }

  openGitHub() {
    window.open('https://github.com/banegasn/components', '_blank');
  }

  openMaterialDesign() {
    window.open('https://m3.material.io/', '_blank');
  }

  openTurborepo() {
    window.open('https://turbo.build/repo/docs', '_blank');
  }

  openLitDocs() {
    window.open('https://lit.dev/', '_blank');
  }

  openNpmPackage(packageName: string) {
    window.open(`https://github.com/Banegasn/components/pkgs/npm/${packageName}`, '_blank');
  }
}
