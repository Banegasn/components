import { Component, ComponentRef, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import '@banegasn/m3-button';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  @Output() closeEvent = new EventEmitter<void>();

  title: string = '';
  width: string = '90%';
  maxWidth: string = '500px';
  closeOnBackdrop: boolean = true;
  showCloseButton: boolean = true;
  
  contentComponent: ComponentRef<any> | null = null;

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

