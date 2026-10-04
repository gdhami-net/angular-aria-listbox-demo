import {Component, signal} from '@angular/core';
import {Listbox, Option} from '@angular/aria/listbox';

/**
 * The same listbox with a hand-written (keydown) handler left on the SAME
 * element as ngListbox. Both handlers run for one key press. This one clamps
 * at the ends, the way a lot of hand-rolled lists do; ngListbox wraps by
 * default, so the two indexes drift apart at the top and the bottom.
 */
@Component({
  selector: 'city-listbox-own-handler',
  imports: [Listbox, Option],
  template: `
    <h2 id="city-label-own">Pick a city</h2>
    <ul
      ngListbox
      aria-labelledby="city-label-own"
      selectionMode="explicit"
      [(value)]="selected"
      (keydown)="onKeydown($event)"
    >
      @for (city of cities; track city; let i = $index) {
        <li ngOption [value]="city" [label]="city" [class.mine]="i === myIndex()">{{ city }}</li>
      }
    </ul>
  `,
})
export class CityListboxOwnHandler {
  readonly cities = ['Doha', 'Dubai', 'Manama', 'Muscat', 'Riyadh'];
  readonly selected = signal<string[]>([]);

  /** The index this component tracks by hand. It clamps instead of wrapping. */
  readonly myIndex = signal(0);

  /** How many times this handler ran. */
  readonly calls = signal(0);

  onKeydown(event: KeyboardEvent): void {
    this.calls.update((n) => n + 1);
    if (event.key === 'ArrowDown') {
      this.myIndex.update((i) => Math.min(i + 1, this.cities.length - 1));
      event.preventDefault();
    }
    if (event.key === 'ArrowUp') {
      this.myIndex.update((i) => Math.max(i - 1, 0));
      event.preventDefault();
    }
  }
}
