# @ayatkevich/query

A lightweight, chainable, **lazy** DOM manipulation library inspired by jQuery,
written in TypeScript. It provides a simple and expressive API for selecting and
manipulating DOM elements, with the added benefit of **lazy evaluation**.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Selecting Elements](#selecting-elements)
    - [Specifying a Root Element](#specifying-a-root-element)
  - [Chaining Methods](#chaining-methods)
  - [Lazy Evaluation](#lazy-evaluation)
    - [Example of Laziness](#example-of-laziness)
  - [Async Unwrapping with `await`](#async-unwrapping-with-await)
    - [Example of Async Unwrapping](#example-of-async-unwrapping)
  - [Class Manipulation](#class-manipulation)
  - [Attribute Manipulation](#attribute-manipulation)
  - [Data Attributes](#data-attributes)
  - [DOM Tree Manipulation](#dom-tree-manipulation)
  - [Event Handling](#event-handling)
- [Testing](#testing)
- [License](#license)

## Installation

```bash
npm install @ayatkevich/query
```

## Usage

### Selecting Elements

Import the `$` class and create a new instance by passing a CSS selector:

```typescript
import { $ } from '@ayatkevich/query';

new $('div');
```

#### Specifying a Root Element

You can optionally specify a root element for your query. By default, the root
is `document`, but you can pass any `Element` as the second argument to scope
your selector:

```typescript
const rootElement = document.getElementById('root');
new $('span', rootElement);
```

This will select all `<span>` elements within `rootElement`, ignoring any
`<span>` elements outside of it.

**Example:**

```typescript
import { $ } from '@ayatkevich/query';

// HTML structure:
// <div id="root">
//   <span class="inside">Inside Root</span>
// </div>
// <span class="outside">Outside Root</span>

const rootElement = document.getElementById('root');
const elements = new $('span', rootElement).unwrap();

console.log(elements.length); // Output: 1
console.log(elements[0].textContent); // Output: "Inside Root"
```

### Chaining Methods

The library supports method chaining for a fluent API:

```typescript
new $('div').addClass('active').setAttribute('role', 'button');
```

### Lazy Evaluation

`@ayatkevich/query` is designed with **laziness** in mind. Mutations are not
immediately applied to the selected elements. Instead, they are deferred and
only executed when necessary. This approach can lead to performance improvements
by reducing unnecessary DOM manipulations.

#### Example of Laziness

Consider the following test cases:

```typescript
import { describe, expect, it } from '@jest/globals';
import { parseHTML } from 'linkedom';
import { $ } from '@ayatkevich/query';

describe('query', () => {
  it('should allow chaining and demonstrate laziness', () => {
    globalThis.document = parseHTML(/* HTML */ `
      <div>Hello</div>
      <div>World</div>
    `).document;

    const chain = new $('div').addClass('foo').addClass('bar');

    // At this point, mutations have not been applied yet due to laziness.

    const [div] = chain; // Accessing the first element applies mutations to it.
    expect(div.classList.contains('foo')).toBe(true);
    expect(div.classList.contains('bar')).toBe(true);

    // The second div has not had mutations applied yet.
    const divs = Array.from(new $('div'));
    expect(divs[1].classList.contains('foo')).toBe(false);
    expect(divs[1].classList.contains('bar')).toBe(false);
  });

  it('should apply mutations to all elements when unwrap() is called', () => {
    globalThis.document = parseHTML(/* HTML */ `
      <div>Hello</div>
      <div>World</div>
    `).document;

    new $('div').addClass('foo').unwrap();

    expect(
      Array.from(document.querySelectorAll('div')).map((element) =>
        Array.from(element.classList)
      )
    ).toEqual([['foo'], ['foo']]);
  });
});
```

In the first test case, mutations are applied lazily. The classes `'foo'` and
`'bar'` are only added to the first `<div>` when it's accessed. The second
`<div>` remains unchanged until it's accessed or until `unwrap()` is called.

In the second test case, `unwrap()` forces all pending mutations to be applied
to every selected element. This is useful when you want to ensure that all
mutations take effect immediately.

### Async Unwrapping with `await`

`@ayatkevich/query` supports async unwrapping using the `await` syntax. This
allows you to apply all pending mutations to all selected elements
asynchronously.

#### Example of Async Unwrapping

```typescript
import { describe, expect, it } from '@jest/globals';
import { parseHTML } from 'linkedom';
import { $ } from '@ayatkevich/query';

describe('query', () => {
  it('should allow async unwrapping with await syntax', async () => {
    globalThis.document = parseHTML(/* HTML */ `
      <div>Hello</div>
      <div>World</div>
    `).document;

    const query = new $('div').addClass('async-test');

    // At this point, mutations have not been applied due to laziness
    const divs = Array.from(document.querySelectorAll('div'));
    expect(divs[0].classList.contains('async-test')).toBe(false);
    expect(divs[1].classList.contains('async-test')).toBe(false);

    // Use await to unwrap the query
    await query;

    // After awaiting, mutations should be applied to all elements
    const updatedDivs = Array.from(document.querySelectorAll('div'));
    expect(updatedDivs[0].classList.contains('async-test')).toBe(true);
    expect(updatedDivs[1].classList.contains('async-test')).toBe(true);
  });
});
```

By awaiting the query, you force all pending mutations to be applied to all
selected elements. This can be especially useful in asynchronous contexts or
when you want to ensure that all mutations are applied before proceeding.

### Class Manipulation

- **`addClass(className: string)`**: Lazily adds a class to the selected
  elements.

  ```typescript
  new $('div').addClass('highlight');
  ```

- **`removeClass(className: string)`**: Lazily removes a class from the selected
  elements.

  ```typescript
  new $('div').removeClass('highlight');
  ```

- **`toggleClass(className: string)`**: Lazily toggles a class on the selected
  elements.

  ```typescript
  new $('div').toggleClass('active');
  ```

- **`replaceClass(oldClassName: string, newClassName: string)`**: Lazily
  replaces an existing class with a new one.

  ```typescript
  new $('div').replaceClass('old-class', 'new-class');
  ```

### Attribute Manipulation

- **`setAttribute(name: string, value: string)`**: Lazily sets an attribute on
  the selected elements.

  ```typescript
  new $('input').setAttribute('placeholder', 'Enter your name');
  ```

- **`removeAttribute(name: string)`**: Lazily removes an attribute from the
  selected elements.

  ```typescript
  new $('input').removeAttribute('disabled');
  ```

- **`toggleAttribute(name: string)`**: Lazily toggles an attribute on the
  selected elements.

  ```typescript
  new $('input').toggleAttribute('readonly');
  ```

### Data Attributes

- **`setData(data: Record<string, string>)`**: Lazily sets data attributes on
  the selected elements.

  ```typescript
  new $('div').setData({ userId: '123', role: 'admin' });
  ```

- **`removeData(key: string)`**: Lazily removes a data attribute from the
  selected elements.

  ```typescript
  new $('div').removeData('userId');
  ```

### DOM Tree Manipulation

- **`append(node: Node)`**: Lazily appends a node to the selected elements.

  ```typescript
  import { html } from '@ayatkevich/query';

  new $('div').append(html`<span>Hello World</span>`);
  ```

- **`prepend(node: Node)`**: Lazily prepends a node to the selected elements.

  ```typescript
  new $('div').prepend(html`<span>Start</span>`);
  ```

- **`remove()`**: Lazily removes the selected elements from the DOM.

  ```typescript
  new $('.obsolete').remove();
  ```

- **`before(node: Element)`**: Lazily inserts a node before the selected
  elements.

  ```typescript
  new $('div').before(html`<hr />`);
  ```

- **`after(node: Element)`**: Lazily inserts a node after the selected elements.

  ```typescript
  new $('div').after(html`<hr />`);
  ```

### Event Handling

- **`on(event: string, handler: (event: Event) => void)`**: Lazily attaches an
  event handler to the selected elements.

  ```typescript
  new $('button').on('click', (event) => {
    console.log('Button clicked!');
  });
  ```

- **`once(event: string, handler: (event: Event) => void)`**: Lazily attaches a
  one-time event handler to the selected elements.

  ```typescript
  new $('button').once('click', (event) => {
    console.log('Button clicked once!');
  });
  ```

## Testing

The library includes a comprehensive test suite using Jest. To run the tests:

```bash
npm test
```

**Example Test Case Using Root Element:**

```typescript
import { describe, expect, it } from '@jest/globals';
import { parseHTML } from 'linkedom';
import { $ } from '@ayatkevich/query';

describe('query', () => {
  it('should allow querying within a specific root element', () => {
    globalThis.document = parseHTML(/* HTML */ `
      <div id="root">
        <span class="inside">Inside Root</span>
      </div>
      <span class="outside">Outside Root</span>
    `).document;

    const rootElement = document.getElementById('root')!;
    const query = new $('span', rootElement);

    const elements = query.unwrap();

    expect(elements.length).toBe(1);
    expect(elements[0].textContent).toBe('Inside Root');
  });
});
```

This test case demonstrates how to use the `root` argument to scope your queries
to a specific element.

## License

This project is licensed under the MIT License.
