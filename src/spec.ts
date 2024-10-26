import { describe, expect, it } from '@jest/globals';
import { parseHTML } from 'linkedom';
import { $ } from '.';

describe('query', () => {
  it('should implement the iterator protocol', () => {
    globalThis.document = parseHTML(`<div>Hello</div>`).document;

    const [div] = new $('div');
    expect(div.textContent).toBe('Hello');
  });
});
