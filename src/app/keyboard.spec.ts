import {TestBed} from '@angular/core/testing';
import {CityListbox} from './city-listbox';
import {CityListboxActiveDescendant} from './city-listbox-activedescendant';
import {activeIndex, listbox, options, press} from './keys';

/**
 * Everything asserted here is behaviour nobody wrote in this repository. The
 * component templates carry ngListbox and ngOption and no key handling.
 */
describe('ngListbox keyboard and ARIA behaviour', () => {
  async function build() {
    TestBed.configureTestingModule({imports: [CityListbox]});
    const fixture = TestBed.createComponent(CityListbox);
    await fixture.whenStable();
    return fixture;
  }

  it('sets the listbox and option roles', async () => {
    const fixture = await build();
    expect(listbox(fixture).getAttribute('role')).toBe('listbox');
    expect(options(fixture).map((li) => li.getAttribute('role'))).toEqual([
      'option',
      'option',
      'option',
      'option',
      'option',
    ]);
  });

  it('starts with the first option active', async () => {
    const fixture = await build();
    expect(activeIndex(fixture)).toBe(0);
  });

  it('moves the active option with ArrowDown and ArrowUp', async () => {
    const fixture = await build();
    await press(fixture, 'ArrowDown');
    expect(activeIndex(fixture)).toBe(1);
    await press(fixture, 'ArrowDown');
    expect(activeIndex(fixture)).toBe(2);
    await press(fixture, 'ArrowUp');
    expect(activeIndex(fixture)).toBe(1);
  });

  it('jumps to the last and first option with End and Home', async () => {
    const fixture = await build();
    await press(fixture, 'End');
    expect(activeIndex(fixture)).toBe(4);
    await press(fixture, 'Home');
    expect(activeIndex(fixture)).toBe(0);
  });

  it('wraps past the first option by default', async () => {
    const fixture = await build();
    await press(fixture, 'ArrowUp');
    expect(activeIndex(fixture)).toBe(4);
  });

  it('moves tabindex=0 with the active option (roving focus, the default)', async () => {
    const fixture = await build();
    expect(options(fixture).map((li) => li.getAttribute('tabindex'))).toEqual([
      '0',
      '-1',
      '-1',
      '-1',
      '-1',
    ]);
    await press(fixture, 'ArrowDown');
    expect(options(fixture).map((li) => li.getAttribute('tabindex'))).toEqual([
      '-1',
      '0',
      '-1',
      '-1',
      '-1',
    ]);
    expect(listbox(fixture).hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('jumps to a row that starts with the character you type', async () => {
    const fixture = await build();
    await press(fixture, 'm');
    expect(activeIndex(fixture)).toBe(2);
    expect(options(fixture)[2].textContent?.trim()).toBe('Manama');
  });

  it('keeps aria-selected in step with the value, with Enter selecting', async () => {
    const fixture = await build();
    expect(options(fixture).map((li) => li.getAttribute('aria-selected'))).toEqual([
      'false',
      'false',
      'false',
      'false',
      'false',
    ]);

    await press(fixture, 'ArrowDown');
    await press(fixture, 'Enter');

    expect(options(fixture).map((li) => li.getAttribute('aria-selected'))).toEqual([
      'false',
      'true',
      'false',
      'false',
      'false',
    ]);
    expect(fixture.componentInstance.selected()).toEqual(['Dubai']);
  });

  it('names the active option with aria-activedescendant in the other focus mode', async () => {
    TestBed.configureTestingModule({imports: [CityListboxActiveDescendant]});
    const fixture = TestBed.createComponent(CityListboxActiveDescendant);
    await fixture.whenStable();

    const ul = listbox(fixture);
    expect(ul.getAttribute('aria-activedescendant')).toBe(options(fixture)[0].id);

    await press(fixture, 'ArrowDown');
    expect(ul.getAttribute('aria-activedescendant')).toBe(options(fixture)[1].id);
    expect(options(fixture).map((li) => li.getAttribute('tabindex'))).toEqual([
      '-1',
      '-1',
      '-1',
      '-1',
      '-1',
    ]);
  });
});
