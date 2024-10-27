# @ayatkevich/query

A lightweight, chainable, **lazy** DOM manipulation library inspired by jQuery,
written in TypeScript. It provides a simple and expressive API for selecting and
manipulating DOM elements, with the added benefit of **lazy evaluation**.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Selecting Elements](#selecting-elements)
  - [Chaining Methods](#chaining-methods)
  - [Lazy Evaluation](#lazy-evaluation)
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

Consider the following test cases from [`src/spec.ts`](./src/spec.ts):

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

**Example Test Case:**

```typescript
import { describe, expect, it, jest } from '@jest/globals';
import { parseHTML } from 'linkedom';
import { $, html } from '@ayatkevich/query';

describe('query', () => {
  it('should allow adding event listeners', () => {
    globalThis.document = parseHTML(
      /* HTML */ `<button>Click me</button>`
    ).document;

    const clickHandler = jest.fn();
    const [button] = new $('button').on('click', clickHandler);

    expect(clickHandler).not.toHaveBeenCalled();

    button.click();

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click' })
    );

    button.click();

    expect(clickHandler).toHaveBeenCalledTimes(2);
  });
});
```

## License

This project is licensed under the MIT License.
