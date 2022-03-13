import { Component, h, Prop, State } from '@stencil/core';
import { API_KEY } from '../../global/global';

interface Button {
  class: string;
  text: string;
  whenClicked: () => void;
}

export interface Footer {
  buttonLabel: string;
  buttonClass: string;
  class: string;
}

@Component({
  tag: 'homepage-component',
  styleUrl: 'homepage-component.css',
  shadow: true,
})
export class HomepageComponent {
  @Prop() about: string;
  @Prop() headline: string;
  @Prop() titleText: string;
  @Prop() mainText: string;
  @Prop() imagePath: string;
  @Prop({ reflect: true, mutable: true }) footers: Footer[];
  @State() isOpen: boolean;
  @State() isIndex: number | null;

  @Prop({ reflect: true, mutable: true }) apiTitle: string;
  @Prop({ reflect: true, mutable: true }) apiContent: string;

  async fetchData(index) {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${this.about}&from=2022-02-13&sortBy=publishedAt&apiKey=${API_KEY}`);
    const data = await response.json();
    this.apiTitle = data.articles[index].title;
    this.apiContent = data.articles[index].description;
  }

  handleClose = () => {
    this.isIndex = null;
    this.isOpen = false;
  };

  handleFooterToggle(footerIndex) {
    this.fetchData(footerIndex);
    this.isIndex = footerIndex;
    this.isOpen = true;
  }

  render() {
    const renderFooter = (footer: Footer) => (
      <div class={`footer ${footer.class}`}>
        <span class="arrow"></span>
        <div class="flx">
          <button onClick={() => this.handleClose()}>X</button>
          <h3>{this.apiTitle}</h3>
        </div>
        <div>
          <p>{this.apiContent}</p>
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
