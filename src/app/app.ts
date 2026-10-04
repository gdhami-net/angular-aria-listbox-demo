import {Component} from '@angular/core';
import {CityListbox} from './city-listbox';
import {CityListboxActiveDescendant} from './city-listbox-activedescendant';
import {CityListboxOwnHandler} from './city-listbox-own-handler';
import {CityListboxWrapperHandler} from './city-listbox-wrapper-handler';

@Component({
  imports: [CityListbox, CityListboxActiveDescendant, CityListboxOwnHandler, CityListboxWrapperHandler],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
