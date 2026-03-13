import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
    selector: 'app-contact',
    template: `
    <div class="page-container docs-page">
      <header class="page-header">
        <h1>Contact</h1>
      </header>
      <section class="doc-section">
        <h2>Get in Touch</h2>
      <p>
        This project is maintained by <strong>&#64;banegasn</strong>. 
        Feel free to reach out for questions, suggestions, or collaborations!
      </p>
      <div class="button-group">
        <m3-button variant="filled" (button-click)="openGitHubProfile()">
          <span slot="icon" class="material-symbols-outlined">link</span>
          Visit GitHub Profile
        </m3-button>
        <m3-button variant="filled" (button-click)="openPayPalDonation()" class="paypal-button">
          <span slot="icon" class="material-symbols-outlined">favorite</span>
          Contribute with PayPal
        </m3-button>
        <m3-button variant="tonal" (button-click)="openGitHubRepos()">
          <span slot="icon" class="material-symbols-outlined">code</span>
          View Repository
        </m3-button>
      </div>
    </section>

      <section class="doc-section" style="margin-top: 2rem;">
        <h2>Contributors</h2>
        <div class="contributors-box">
          <p style="font-size: 1.2rem; margin-bottom: 1.5rem;">
            <span class="material-symbols-outlined" style="vertical-align: middle; font-size: 2rem; margin-right: 0.5rem;">volunteer_activism</span>
            We're looking for contributors!
          </p>
          <p>
            Want to be part of this project? Contributions are welcome and greatly appreciated. 
            Whether it's fixing bugs, adding new components, improving documentation, or suggesting features—every contribution counts!
          </p>
          <div class="button-group" style="margin-top: 1.5rem;">
            <m3-button variant="filled" (button-click)="openGitHubProfile()">
              <span slot="icon" class="material-symbols-outlined">group_add</span>
              Become a Contributor
            </m3-button>
          </div>
        </div>
      </section>
    </div>
  `,
    styles: [`
      .page-header {
        margin-bottom: 2rem;
      }

      .page-header h1 {
        margin: 0;
      }

      section {
        margin-bottom: 2rem;
      }

      .doc-section {
        margin-top: 2rem;
      }

      .contributors-box {
        background-color: var(--md-sys-color-secondary-container, #d8e3f0);
        color: var(--md-sys-color-on-secondary-container, #1d192b);
        padding: 2rem;
        border-radius: 1rem;
        border: 2px dashed var(--md-sys-color-outline, #b9b9b9);
        text-align: center;
        margin-top: 1.5rem;
      }

      .contributors-box p {
        color: var(--md-sys-color-on-secondary-container, #1d192b);
      }

      .paypal-button {
        --md-sys-color-primary: #0070ba;
        --md-sys-color-on-primary: #ffffff;
        --md-sys-color-primary-hover: #0070ba;
      }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: []
})
export class ContactComponent {
  openGitHubProfile() {
    window.open('https://github.com/banegasn', '_blank');
  }

  openGitHubRepos() {
    window.open('https://github.com/banegasn/components', '_blank');
  }

  openPayPalDonation() {
    window.open('https://paypal.me/banegasn', '_blank');
  }
}

