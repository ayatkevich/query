import { describe, expect, it, jest } from '@jest/globals';
import { parseHTML } from 'linkedom';
import { $, html } from '.';

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

  it('should allow manipulating the DOM tree', () => {
    globalThis.document = parseHTML(/* HTML */ `<div></div>`).document;

    {
      const [div] = new $('div').append(html`<span>Hello</span>`);
      expect(div.outerHTML).toBe('<div><span>Hello</span></div>');
    }

    {
      const [div] = new $('div').prepend(html`<span>World</span>`);
      expect(div.outerHTML).toBe(
        '<div><span>World</span><span>Hello</span></div>'
      );
    }

    {
      new $('span').remove().unwrap();
      const [div] = new $('div');
      expect(div.outerHTML).toBe('<div></div>');
    }

    {
      [...new $('div').append(html`<span>World</span>`)];
      [...new $('span').before(html`<span>Hello</span>`)];
      const [div] = new $('div');
      expect(div.outerHTML).toBe(
        '<div><span>Hello</span><span>World</span></div>'
      );
    }

    {
      [...new $('span').after(html`<span>!</span>`)];
      const [div] = new $('div');
      expect(div.outerHTML).toBe(
        '<div><span>Hello</span><span>World</span><span>!</span></div>'
      );
    }
  });

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

  it('should allow adding one-time event listeners with once', () => {
    globalThis.document = parseHTML(
      /* HTML */ `<button>Click me once</button>`
    ).document;

    const clickHandler = jest.fn();
    const [button] = new $('button').once('click', clickHandler);

    expect(clickHandler).not.toHaveBeenCalled();

    button.click();

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click' })
    );

    button.click();

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

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
