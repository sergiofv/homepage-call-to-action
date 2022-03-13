import { Component, h, Prop, State } from '@stencil/core';

interface Button {
  class: string;
  text: string;
  whenClicked: () => void;
}

export interface Footer {
  buttonLabel: string;
  buttonClass: string;
  title: string;
  content: string;
  isShown: boolean | null;
  class: string;
}

@Component({
  tag: 'homepage-component',
  styleUrl: 'homepage-component.css',
  shadow: true,
})
export class HomepageComponent {
  @Prop() headline: string;
  @Prop() titleText: string;
  @Prop() mainText: string;
  @Prop() imagePath: string;
  @Prop({ reflect: true, mutable: true }) footers: Footer[];
  @State() isOpen: boolean;
  @State() isIndex: number | null;

  // use only index state, null is false, number is true (active index = true)
  // fetch API for button data, consume text for buttonLabel and content
  // toggle when clicking button (close again)

  handleClose = () => {
    this.isIndex = null;
    this.isOpen = false;
  };

  handleFooterToggle(footerIndex) {
    this.isIndex = footerIndex;
    this.isOpen = true;
  }

  render() {
    const renderFooter = (footer: Footer) => (
      <div class={`footer ${footer.class}`}>
        <span class="arrow"></span>
        <div class="flx">
          <button onClick={() => this.handleClose()}>X</button>
          <h3>{footer.title}</h3>
        </div>
        <div>
          <p>{footer.content}</p>
        </div>
      </div>
    );

    const buttons: Button[] = this.footers.map((footer, i) => ({
      class: footer.buttonClass,
      text: footer.buttonLabel,
      whenClicked: () => this.handleFooterToggle(i),
    }));

    const renderButton = (button: Button) => (
      <button onClick={button.whenClicked} class={button.class}>
        {button.text}
      </button>
    );

    return (
      <div class="component flx">
        <div class="headline">
          <h1>{this.headline}</h1>
        </div>
        <div class="banner flx">
          <div class="banner__half flx">
            <div class="banner__info">
              <h3 class="banner__title">{this.titleText}</h3>
              <p>{this.mainText}</p>
              <div class="flx">{buttons.map(renderButton)}</div>
            </div>
          </div>
          <div class="banner__half">{<img src={this.imagePath} />}</div>
        </div>
        {this.isOpen && renderFooter(this.footers[this.isIndex])}
      </div>
    );
  }
}
