# angular-aria-listbox-demo

Companion to the post **"Add keyboard and screen-reader support to an Angular
listbox with @angular/aria"**.

`@angular/aria` ships headless directives for the WAI-ARIA patterns. Put
`ngListbox` on a `<ul>` and `ngOption` on each `<li>` and you get the roles,
`aria-selected`, `aria-activedescendant`, focus management and the whole
keyboard contract, with no styling and no key handling of your own.

The catch is that the directive binds `keydown` on its host element and its
key bindings call `preventDefault()` and `stopPropagation()` by default. A
hand-written keydown handler that survives the migration behaves badly in two
different ways, and both are asserted here.

## What it proves

`src/app/keyboard.spec.ts` — behaviour nobody in this repository wrote. The
templates in `src/app/city-listbox.ts` and
`src/app/city-listbox-activedescendant.ts` carry `ngListbox` and `ngOption`
and nothing else.

| assertion | what the DOM shows |
| --- | --- |
| roles | `role="listbox"` on the `<ul>`, `role="option"` on every `<li>` |
| initial state | the first option is active before any key press |
| `ArrowDown` / `ArrowUp` | the active option moves one step |
| `End` / `Home` | the active option jumps to the last / first |
| typing `m` | type-ahead jumps to `Manama` |
| `ArrowUp` on the first option | wraps to the last (`wrap` defaults to `true`) |
| `ArrowDown` on the last option | wraps to the first |
| roving focus (the default) | `tabindex="0"` on the active option, `-1` on the rest, and no `aria-activedescendant` on the `<ul>` |
| `Enter` with `selectionMode="explicit"` | `aria-selected="true"` on that option only, and the `value` model signal becomes `['Dubai']` |
| `Space` with `selectionMode="explicit"` | selects the same way `Enter` does |
| `focusMode="activedescendant"` | `aria-activedescendant` on the `<ul>` names the active option's id, and every option's `tabindex` is `-1` |

`src/app/conflict.spec.ts` — what a hand-written `(keydown)` handler does once
the directive is on the same markup.

| where the handler sits | what happens |
| --- | --- |
| on the same element as `ngListbox` (`src/app/city-listbox-own-handler.ts`) | it still runs for every key press. `stopPropagation()` does not stop another listener on the same node. The component's own index clamps at the first row while the directive wraps to the last, so after `ArrowDown`, `ArrowUp`, `ArrowUp` the directive's active row is index 4 and the hand-written highlight is on index 0. |
| on a wrapper around the listbox (`src/app/city-listbox-wrapper-handler.ts`) | it never runs for `ArrowDown`, `End`, or any single-character key, because the directive's bindings call `stopPropagation()`. `Escape` is not bound by the listbox, so that one still reaches the wrapper. |

The single-character row is the typeahead binding. `@angular/aria`'s listbox
matches `/^.$/` for type-ahead search, so every printable key is consumed and
never reaches an ancestor.

## How to run it

```
npm install
npm run check      # ng test --no-watch, the 13 assertions above
npm start          # http://localhost:4200, all four lists side by side
```

`npm run check` output:

```
 Test Files  2 passed (2)
      Tests  13 passed (13)
```

## Versions these numbers came from

| | |
| --- | --- |
| `@angular/core`, `@angular/aria`, `@angular/cdk` | 22.2.1 |
| test runner (`@angular/build:unit-test`) | Vitest 5.0.3 on jsdom 30.1.2 |
| TypeScript | 6.0.3 |
| Node | 26.1.0 |
| OS | Windows 11 |

`@angular/aria` was introduced in Angular v21 as a developer preview and
became stable in v22 (released 2026-06-03).

## Notes that did not fit in the post

- **`selectionMode` defaults to `'follow'`**, which selects whatever the arrow
  keys land on. The components here pass `selectionMode="explicit"` so that
  `Enter` or `Space` is what selects. If you are porting a list where moving
  the highlight was never meant to change the selection, set it explicitly.
- **Other defaults**, read off `Listbox` in `@angular/aria` 22.2.1:
  `orientation="vertical"`, `multi="false"`, `wrap="true"`,
  `softDisabled="true"`, `focusMode="roving"`, `typeaheadDelay=500`.
- **`aria-selected` is rendered on every option**, as `"false"` or `"true"`,
  not only on the selected one.
- **`@angular/cdk/listbox` still exists** and carries no deprecation marker in
  22.2.1. It covers one pattern with a decorator-era API; `@angular/aria`
  covers twelve patterns with signal inputs, a `value` model signal, test
  harnesses under `@angular/aria/listbox/testing` and Signal Forms support.
  The CDK listbox does not implement selection-follows-focus at all, which is
  `@angular/aria`'s default.
- **`horizontal` orientation** swaps the arrow keys to left/right and reverses
  them under RTL. Not covered by the specs here.
- **The harnesses** (`ListboxHarness`, `ListboxOptionHarness`) are an
  alternative to reading attributes off the DOM the way these specs do. The
  specs go at the DOM directly so that the assertions name the exact attribute
  the post talks about.

## Layout

```
src/app/
  city-listbox.ts                      ngListbox with no key handling at all
  city-listbox-activedescendant.ts     the same list in the other focus mode
  city-listbox-own-handler.ts          a (keydown) handler on the same element
  city-listbox-wrapper-handler.ts      a (keydown) handler on a wrapper
  keys.ts                              dispatches one bubbling keydown
  keyboard.spec.ts                     what the directives give you
  conflict.spec.ts                     what your own handler does to it
  app.ts, app.html, app.css            the page npm start serves
```

## Licence

MIT. See [LICENSE](LICENSE).
