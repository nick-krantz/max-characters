import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class MaxCharacters extends LitElement {
  static styles = css`
    :host {
      display: block;
      --light-bg-color: #fafafa;
      --light-highlight-color: #f56565;
      --dark-bg-color: #0d0d0d;
      --dark-highlight-color: #8a0d20;
      --text-box-padding: 0.75rem;
      --border-width: 1px;
      --min-height: 4rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .text-box {
      padding: var(--text-box-padding);
      border-radius: 6px;
      min-height: var(--min-height);
    }

    .editable-content-wrapper {
      position: relative;
      margin: 0.5rem;
    }

    /** position overlay to be directly behind .text-box */
    .overlay {
      --position: calc(var(--text-box-padding) + var(--border-width));
      position: absolute;
      width: calc(100% - calc(var(--position) * 2));
      height: calc(100% - calc(var(--position) * 2));
      left: var(--position);
      top: var(--position);
      z-index: -1;
      word-break: break-word;
      color: transparent; // transparent text to never have an overlap effect
    }

    @media (prefers-color-scheme: light) {
      .text-box {
        border: var(--border-width) solid var(--dark-bg-color);
        color: --dark-bg-color;
      }

      .red {
        background-color: var(--light-highlight-color);
      }
    }

    @media (prefers-color-scheme: dark) {
      .text-box {
        border: var(--border-width) solid var(--light-bg-color);
        color: white;
      }

      .red {
        background-color: var(--dark-highlight-color);
      }
    }
  `;

  /**
   * The characters that exceed the max will be highlighted
   * @default 40
   */
  @property({ type: Number }) max = 40;

  /** Sent content of the overlay based on the length of the editable textContent */
  private captureValue(e: InputEvent): void {
    const editableDiv = e.target as HTMLDivElement;
    const textContent = editableDiv.textContent || '';
    const overlay = this.renderRoot.querySelector('.overlay');

    if (!overlay) return;

    if (textContent.length <= this.max) {
      overlay.innerHTML = `<span>${textContent}</span>`;
    } else {
      overlay.innerHTML = `<span>${textContent.substring(
        0,
        this.max
      )}</span><span class="red">${textContent.substring(this.max)}</span>`;
    }
  }

  render() {
    return html`
      <div class="editable-content-wrapper">
        <div
          part="text-box"
          class="text-box"
          aria-label="Text area allowing ${this.max} characters"
          aria-multiline="true"
          contenteditable="true"
          role="textbox"
          spellcheck="true"
          tabindex="0"
          @input="${this.captureValue}"
        ></div>
        <div class="overlay" aria-hidden="true"></div>
      </div>
    `;
  }
}
