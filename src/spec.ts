import { describe, expect, it } from '@jest/globals';
import { parseHTML } from 'linkedom';
import { $ } from '.';

describe('query', () => {
  it('should implement the iterator protocol', () => {
    globalThis.document = parseHTML(`<div>Hello</div>`).document;

    const [div] = new $('div');
    expect(div.textContent).toBe('Hello');
  });

  it('should add class', () => {
    globalThis.document = parseHTML(/* HTML */ `
      <div>Hello</div>
      <div>World</div>
    `).document;

    const [div] = new $('div').addClass('foo');
    expect(div.classList.contains('foo')).toBe(true);

    // since the iterator is lazy, the second div should not have the class
    expect(
      Array.from(new $('div')).map((element) =>
        Array.from(element.classList.values())
      )
    ).toEqual([['foo'], []]);
  });
});
