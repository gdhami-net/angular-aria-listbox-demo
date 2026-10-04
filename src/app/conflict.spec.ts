import {TestBed} from '@angular/core/testing';
import {CityListboxOwnHandler} from './city-listbox-own-handler';
import {CityListboxWrapperHandler} from './city-listbox-wrapper-handler';
import {activeIndex, listbox, options, press} from './keys';

/**
 * What a hand-written (keydown) handler does once ngListbox is on the same
 * markup. These two specs are the reason the post says to delete it.
 */
describe('a hand-written keydown handler next to ngListbox', () => {
  it('still runs on the same element, and drifts out of step at the ends', async () => {
    TestBed.configureTestingModule({imports: [CityListboxOwnHandler]});
    const fixture = TestBed.createComponent(CityListboxOwnHandler);
    await fixture.whenStable();
    const component = fixture.componentInstance;

    // Both handlers move one step down, so they agree in the middle.
    await press(fixture, 'ArrowDown');
    expect(component.calls()).toBe(1);
    expect(activeIndex(fixture)).toBe(1);
    expect(component.myIndex()).toBe(1);

    // At the top they part company: ngListbox wraps, the hand-written
    // handler clamps. Two different rows now look active.
    await press(fixture, 'ArrowUp');
    await press(fixture, 'ArrowUp');
    expect(component.calls()).toBe(3);
    expect(activeIndex(fixture)).toBe(4);
    expect(component.myIndex()).toBe(0);

    const highlighted = options(fixture).findIndex((li) => li.classList.contains('mine'));
    expect(highlighted).toBe(0);
    expect(highlighted).not.toBe(activeIndex(fixture));
  });

  it('never runs on a wrapper for the keys the listbox claims', async () => {
    TestBed.configureTestingModule({imports: [CityListboxWrapperHandler]});
    const fixture = TestBed.createComponent(CityListboxWrapperHandler);
    await fixture.whenStable();
    const component = fixture.componentInstance;

    // ngListbox calls stopPropagation() for each key it binds, so nothing
    // above the <ul> hears these.
    await press(fixture, 'ArrowDown');
    await press(fixture, 'End');
    await press(fixture, 'a');
    expect(component.seen()).toEqual([]);

    // A key the listbox does not bind still reaches the wrapper.
    await press(fixture, 'Escape');
    expect(component.seen()).toEqual(['Escape']);

    // Sanity: the listbox itself handled the keys above.
    expect(activeIndex(fixture)).toBe(4);
    expect(listbox(fixture).getAttribute('role')).toBe('listbox');
  });
});
