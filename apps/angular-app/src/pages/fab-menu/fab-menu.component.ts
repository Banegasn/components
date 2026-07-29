import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CodeBlockComponent } from '../../app/components/code-block/code-block.component';
import '@banegasn/m3-fab-menu';
import '@banegasn/m3-menu';

@Component({
  selector: 'app-fab-menu',
  standalone: true,
  templateUrl: './fab-menu.component.html',
  styleUrls: ['./fab-menu.component.css'],
  imports: [CodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FabMenuComponent {
  readonly basicExample = `<m3-fab-menu label="Create item">
  <m3-menu slot="menu" placement="top-end">
    <m3-menu-item value="edit">Edit</m3-menu-item>
    <m3-menu-item value="delete">Delete</m3-menu-item>
  </m3-menu>
</m3-fab-menu>`;
}
