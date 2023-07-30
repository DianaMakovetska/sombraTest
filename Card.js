import { Sleep } from './Sleep.js';

export class Card {
  constructor(value, theme, width, height, id, matchGrid) {
    this.value = value;
    this.theme = theme;
    this.width = width;
    this.height = height;
    this.id = id;
    this.isCompleted = false;
    this.matchGrid = matchGrid;
    this.element = this.createCardElement();
    this.element.setAttribute('id', `card-${this.id}`);
    this.element.addEventListener('click', this.onClick.bind(this));
    this.isFlipping = false;
  }

  createCardElement() {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const frontSide = document.createElement('div');
    frontSide.classList.add('front');
    frontSide.style.backgroundColor = this.theme.frontColor;
    frontSide.style.color = this.theme.frontTextColor;
    cardElement.appendChild(frontSide);

    const backSide = document.createElement('div');
    backSide.classList.add('back');
    backSide.textContent = this.value;
    backSide.style.fontFamily = this.theme.font;
    backSide.style.backgroundColor = this.theme.backColor;
    backSide.style.color = this.theme.backTextColor;

    cardElement.appendChild(backSide);

    cardElement.style.width = this.width + 'px';
    cardElement.style.height = this.height + 'px';
    return cardElement;
  }

  onClick() {
    if (this.isFlipping || this.matchGrid.openedCards.length === 2) {
      return;
    }

    if (this.matchGrid.openedCards.includes(this)) {
      return;
    }

    this.matchGrid.openedCards.push(this);

    this.isFlipping = true;

    this.flipCard('+=180');

    if (this.matchGrid.openedCards.length === 2) {
      const card1 = this.matchGrid.openedCards[0];
      const card2 = this.matchGrid.openedCards[1];
      this.matchGrid.checkCardsMatching();

      Sleep(1000).then(() => {
        card1.close();
        card2.close();
        this.matchGrid.openedCards = [];
      });
    }
  }

  close() {
    this.flipCard('-=180');
  }

  flipCard(rotateValue) {
    anime({
      targets: this.element,
      scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
      rotateY: { value: rotateValue, delay: 200 },
      easing: 'easeInOutSine',
      duration: 400,
      complete: () => {
        this.isFlipping = false;
      },
    });
  }
}
