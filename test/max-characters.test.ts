import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { MaxCharacters } from '../src/MaxCharacters.js';
import '../src/max-characters.js';

describe('MaxCharacters', () => {
  it('defaults max to 40', async () => {
    const el = await fixture<MaxCharacters>(
      html`<max-characters></max-characters>`
    );

    expect(el.max).to.equal(40);
  });

  it('can override the maximum via attribute', async () => {
    const el = await fixture<MaxCharacters>(
      html`<max-characters max="20"></max-characters>`
    );

    expect(el.max).to.equal(20);
  });

  it('sets aria-label', async () => {
    const el = await fixture<MaxCharacters>(
      html`<max-characters max="20"></max-characters>`
    );
    const textBox = el.renderRoot.querySelector('.text-box');

    expect(textBox?.ariaLabel).to.equal('Text area allowing 20 characters');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<MaxCharacters>(
      html`<max-characters></max-characters>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

  it('replaces overlay content with text-box content', async () => {
    const el = await fixture<MaxCharacters>(
      html`<max-characters max="20"></max-characters>`
    );

    const textBox = el.renderRoot.querySelector('.text-box');

    if (textBox) {
      textBox.textContent = 'less than 20';
      textBox?.dispatchEvent(new Event('input'));

      const overlay = el.renderRoot.querySelector('.overlay');

      await expect(overlay?.textContent).to.be.eq('less than 20');
    } else {
      expect.fail('missing text box');
    }
  });

  it('marks content exceeding defined max', async () => {
    const el = await fixture<MaxCharacters>(
      html`<max-characters max="25"></max-characters>`
    );

    const textBox = el.renderRoot.querySelector('.text-box');

    if (textBox) {
      textBox.textContent = 'more than 25 characters, right?';
      textBox?.dispatchEvent(new Event('input'));

      const overlay = el.renderRoot.querySelector('.overlay');

      await expect(overlay?.textContent).to.be.eq(
        'more than 25 characters, right?'
      );
      await expect(overlay?.innerHTML).to.be.eq(
        '<span>more than 25 characters, </span><span class="red">right?</span>'
      );
    } else {
      expect.fail('missing text box');
    }
  });
});
