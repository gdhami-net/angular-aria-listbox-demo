import {Component, signal} from '@angular/core';
import {Listbox, Option} from '@angular/aria/listbox';

/**
 * A hand-written (keydown) handler on a wrapper AROUND the listbox. The
 * directive's own key bindings call stopPropagation(), so for every key the
 * listbox claims this handler never runs at all.
 */
@Component({
  selector: 'city-listbox-wrapper-handler',
  imports: [Listbox, Option],
  template: `
    <div class="wrapper" (keydown)="onKeydown($event)">
      <h2 id="city-label-wrap">Pick a city</h2>
      <ul ngListbox aria-labelledby="city-label-wrap" selectionMode="explicit" [(value)]="selected">
        @for (city of cities; track city) {
          <li ngOption [value]="city" [label]="city">{{ city }}</li>
        }
      </ul>
    </div>
  `,
})
export class CityListboxWrapperHandler {
  readonly cities = ['Doha', 'Dubai', 'Manama', 'Muscat', 'Riyadh'];
  readonly selected = signal<string[]>([]);

  /** Every key this wrapper handler actually saw. */
  readonly seen = signal<string[]>([]);

  onKeydown(event: KeyboardEvent): void {
    this.seen.update((keys) => [...keys, event.key]);
  }
}
