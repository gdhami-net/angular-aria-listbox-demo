import {Component, signal} from '@angular/core';
import {Listbox, Option} from '@angular/aria/listbox';

/**
 * A listbox with no key handling of its own. Every keyboard behaviour in the
 * specs (ArrowUp/ArrowDown/Home/End, roving tabindex, aria-selected) comes
 * from the `ngListbox` and `ngOption` directives.
 */
@Component({
  selector: 'city-listbox',
  imports: [Listbox, Option],
  template: `
    <h2 id="city-label">Pick a city</h2>
    <ul ngListbox aria-labelledby="city-label" selectionMode="explicit" [(value)]="selected">
      @for (city of cities; track city) {
        <li ngOption [value]="city" [label]="city">{{ city }}</li>
      }
    </ul>
  `,
})
export class CityListbox {
  readonly cities = ['Doha', 'Dubai', 'Manama', 'Muscat', 'Riyadh'];
  readonly selected = signal<string[]>([]);
}
