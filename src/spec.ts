import { describe, expect, it } from '@jest/globals';
import { parseHTML } from 'linkedom';
import { $ } from '.';

describe('query', () => {
  it('should implement the iterator protocol', () => {
    globalThis.document = parseHTML(`<div>Hello</div>`).document;

    const [div] = new $('div');
    expect(div.textContent).toBe('Hello');
  });

  it('should allow chaining', () => {
    globalThis.document = parseHTML(/* HTML */ `
      <div>Hello</div>
      <div>World</div>
    `).document;

    const [div] = new $('div').addClass('foo').addClass('bar');
    expect(div.classList.contains('foo')).toBe(true);
    expect(div.classList.contains('bar')).toBe(true);

    // since the iterator is lazy, the second div should not have the class
    expect(
      Array.from(new $('div')).map((element) =>
        Array.from(element.classList.values())
      )
    ).toEqual([['foo', 'bar'], []]);
  });

  it('should provide a method to apply all mutations to every element', () => {
    globalThis.document = parseHTML(/* HTML */ `
      <div>Hello</div>
      <div>World</div>
    `).document;

    new $('div').addClass('foo').unwrap();

    expect(
      Array.from(document.querySelectorAll('div')).map((element) =>
        Array.from(element.classList.values())
      )
    ).toEqual([['foo'], ['foo']]);
  });

  it('should allow manipulating classes', () => {
    globalThis.document = parseHTML(/* HTML */ `<div></div>`).document;

    {
      const [div] = new $('div').addClass('foo');
      expect(div.classList.contains('foo')).toBe(true);
    }

    {
      const [div] = new $('div').removeClass('foo');
      expect(div.classList.contains('foo')).toBe(false);
    }

    {
      const [div] = new $('div').toggleClass('foo');
      expect(div.classList.contains('foo')).toBe(true);
    }

    {
      const [div] = new $('div').replaceClass('foo', 'bar');
      expect(div.classList.contains('foo')).toBe(false);
      expect(div.classList.contains('bar')).toBe(true);
    }
  });

  it('should allow manipulating attributes', () => {
    globalThis.document = parseHTML(/* HTML */ `<div></div>`).document;

    {
      const [div] = new $('div').setAttribute('foo', 'bar');
      expect(div.getAttribute('foo')).toBe('bar');
    }

    {
      const [div] = new $('div').removeAttribute('foo');
      expect(div.getAttribute('foo')).toBe(null);
    }

    {
      const [div] = new $('div').toggleAttribute('foo');
      expect(div.getAttribute('foo')).toBe('');
    }
  });

  it('should allow manipulating data attributes', () => {
    globalThis.document = parseHTML(/* HTML */ `<div></div>`).document;

    {
      const [div] = new $('div').setData({ foo: 'baz' });
      expect(div.dataset.foo).toBe('baz');
    }

    {
      const [div] = new $('div').removeData('foo');
      expect(div.dataset.foo).toBe(undefined);
    }
  });
});
