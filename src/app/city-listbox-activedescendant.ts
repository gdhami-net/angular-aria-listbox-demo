import {Component, signal} from '@angular/core';
import {Listbox, Option} from '@angular/aria/listbox';

/**
 * The same listbox in the other focus mode. Focus stays on the <ul> and the
 * active option is named by aria-activedescendant instead of by tabindex.
 */
@Component({
  selector: 'city-listbox-ad',
  imports: [Listbox, Option],
  template: `
    <h2 id="city-label-ad">Pick a city</h2>
    <ul
      ngListbox
      aria-labelledby="city-label-ad"
      focusMode="activedescendant"
      selectionMode="explicit"
      [(value)]="selected"
    >
      @for (city of cities; track city) {
        <li ngOption [value]="city" [label]="city">{{ city }}</li>
      }
    </ul>
  `,
})
export class CityListboxActiveDescendant {
  readonly cities = ['Doha', 'Dubai', 'Manama', 'Muscat', 'Riyadh'];
  readonly selected = signal<string[]>([]);
}
