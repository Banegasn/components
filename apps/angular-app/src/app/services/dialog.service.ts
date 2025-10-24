import { Injectable, ComponentRef, ApplicationRef, createComponent, EnvironmentInjector, Type, inject } from '@angular/core';
import { DialogComponent } from '../components/dialog/dialog.component';

export interface DialogConfig {
  title?: string;
  width?: string;
  maxWidth?: string;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
}

export interface DialogRef<T = any> {
  close: (result?: T) => void;
  afterClosed: () => Promise<T | undefined>;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  
  private dialogComponentRef: ComponentRef<DialogComponent> | null = null;

  open<T>(component: Type<any>, config?: DialogConfig): DialogRef<T> {
    // Create the dialog container component
    this.dialogComponentRef = createComponent(DialogComponent, {
      environmentInjector: this.injector
    });

    const dialogInstance = this.dialogComponentRef.instance;
    
    // Apply configuration
    if (config?.title) dialogInstance.title = config.title;
    if (config?.width) dialogInstance.width = config.width;
    if (config?.maxWidth) dialogInstance.maxWidth = config.maxWidth;
    if (config?.closeOnBackdrop !== undefined) dialogInstance.closeOnBackdrop = config.closeOnBackdrop;
    if (config?.showCloseButton !== undefined) dialogInstance.showCloseButton = config.showCloseButton;

    // Create the content component
    const contentComponentRef = createComponent(component, {
      environmentInjector: this.injector
    });

    // Set the content
    dialogInstance.contentComponent = contentComponentRef;

    // Attach to application
    this.appRef.attachView(this.dialogComponentRef.hostView);
    this.appRef.attachView(contentComponentRef.hostView);

    // Append to DOM
    const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Create dialog reference
    let resolvePromise: (value: T | undefined) => void;
    const afterClosedPromise = new Promise<T | undefined>((resolve) => {
      resolvePromise = resolve;
    });

    const dialogRef: DialogRef<T> = {
      close: (result?: T) => {
        this.closeDialog();
        resolvePromise(result);
      },
      afterClosed: () => afterClosedPromise
    };

    // Handle close events from dialog component
    dialogInstance.closeEvent.subscribe(() => {
      dialogRef.close();
    });

    // Pass the dialog ref to the content component if it has a dialogRef property
    if ('dialogRef' in contentComponentRef.instance) {
      (contentComponentRef.instance as any).dialogRef = dialogRef;
    }

    return dialogRef;
  }

  private closeDialog(): void {
    if (this.dialogComponentRef) {
      const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0] as HTMLElement;
      
      // Add fade-out animation
      domElem.style.animation = 'fadeOut 0.2s ease-in-out';
      
      setTimeout(() => {
        this.appRef.detachView(this.dialogComponentRef!.hostView);
        this.dialogComponentRef?.destroy();
        this.dialogComponentRef = null;
      }, 200);
    }
  }
}

