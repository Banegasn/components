import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
    selector: 'app-contact',
    template: `
    <h1>Contact</h1>
    <section>
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
        <m3-button variant="tonal" (button-click)="openGitHubRepos()">
          <span slot="icon" class="material-symbols-outlined">code</span>
          View Repositories
        </m3-button>
      </div>
    </section>

    <section style="margin-top: 3rem;">
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
  `,
    styles: [`
      section {
        margin-bottom: 2rem;
      }

      .contributors-box {
        background-color: var(--md-sys-color-secondary-container, #d8e3f0);
        color: var(--md-sys-color-on-secondary-container, #1d192b);
        padding: 2rem;
        border-radius: 1rem;
        border: 2px dashed var(--md-sys-color-outline, #b9b9b9);
        text-align: center;
      }

      .contributors-box p {
        color: var(--md-sys-color-on-secondary-container, #1d192b);
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
}

