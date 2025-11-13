import { Component, ComponentRef, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';

import '@banegasn/m3-button';
import '@banegasn/m3-switch';

@Component({
  selector: 'app-dialog',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, OnDestroy {
  @Output() closeEvent = new EventEmitter<void>();

  title: string = '';
  width: string = '90%';
  maxWidth: string = '500px';
  closeOnBackdrop: boolean = true;
  showCloseButton: boolean = true;
  contentComponent: ComponentRef<any> | null = null;

  private escapeKeyHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.close();
    }
  };

  ngOnInit(): void {
    // Listen for Escape key to close dialog
    document.addEventListener('keydown', this.escapeKeyHandler);
  }

  ngOnDestroy(): void {
    // Remove Escape key listener
    document.removeEventListener('keydown', this.escapeKeyHandler);
  }

  handleBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && (event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.closeEvent.emit();
    }
  }

  close(): void {
    this.closeEvent.emit();
  }

  ngAfterViewInit(): void {
    // Insert the content component into the dialog content container
    if (this.contentComponent) {
      const contentContainer = document.querySelector('.dialog-content-wrapper');
      if (contentContainer) {
        const contentElement = (this.contentComponent.hostView as any).rootNodes[0] as HTMLElement;
        contentContainer.appendChild(contentElement);
      }
    }
  }
}

