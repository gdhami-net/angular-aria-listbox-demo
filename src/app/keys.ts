import {ComponentFixture} from '@angular/core/testing';

/** The <ul ngListbox> element of a fixture. */
export function listbox(fixture: ComponentFixture<unknown>): HTMLElement {
  const el = (fixture.nativeElement as HTMLElement).querySelector('ul');
  if (!el) throw new Error('no <ul> in this fixture');
  return el;
}

/** The <li ngOption> elements of a fixture, in document order. */
export function options(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('li'));
}

/**
 * Sends one key to the listbox the way the browser does: a bubbling keydown
 * on the element the user is focused on. In roving mode that is the active
 * option; the event bubbles to the <ul> where ngListbox listens.
 */
export async function press(fixture: ComponentFixture<unknown>, key: string): Promise<void> {
  const active = options(fixture).find((li) => li.getAttribute('data-active') === 'true');
  (active ?? listbox(fixture)).dispatchEvent(
    new KeyboardEvent('keydown', {key, bubbles: true, cancelable: true}),
  );
  await fixture.whenStable();
}

/** The index of the option ngListbox considers active. */
export function activeIndex(fixture: ComponentFixture<unknown>): number {
  return options(fixture).findIndex((li) => li.getAttribute('data-active') === 'true');
}
