import { Card } from './Card.js';
import { Sleep } from './Sleep.js';
import { CountdownTimer } from './Timer.js';

export class MatchGrid {
  constructor(args) {
    this.width = args.width || 800;
    this.height = args.height || 600;
    this.numColumns = args.numColumns || 4;
    this.numRows = args.numRows || 4;
    this.timeLimit = args.timeLimit || 60;
    this.theme = args.theme || {
      backColor: '#fafafa',
      frontColor: '#34d8eb',
      font: 'Roboto',
    };
    this.cards = [];
    this.onFinish = this.onFinish.bind(this);
    this.timer = new CountdownTimer(
      this.timeLimit,
      this.updateTimerDisplay,
      this.onFinish
    );
    this.openedCards = [];
    this.calculateCardSize();
    this.containerClicking(false);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.timer.pause();
      } else {
        this.timer.isWorking && this.timer.resume();
      }
    });
  }

  calculateCardSize() {
    const totalGapWidth = (this.numColumns - 1) * 10;
    const availableWidth = this.width - totalGapWidth;

    const totalGapHeight = (this.numRows - 1) * 10;
    const availableHeight = this.height - totalGapHeight;

    this.cardWidth = Math.floor(availableWidth / this.numColumns);
    this.cardHeight = Math.floor(availableHeight / this.numRows);
  }

  generateGrid() {
    const gameContainer = document.getElementById('game-container');

    gameContainer.style.width = this.width + 'px';
    gameContainer.style.height = this.height + 'px';
    gameContainer.style.gridTemplateColumns = `repeat(${this.numColumns}, 1fr)`;

    const totalCards = this.numRows * this.numColumns;
    const cardValues = this.generateShuffledCardValues(totalCards);

    for (let i = 0; i < totalCards; i++) {
      const cardValue = cardValues[i];
      const card = new Card(
        cardValue,
        this.theme,
        this.cardWidth,
        this.cardHeight,
        i,
        this
      );

      this.cards.push(card);
      gameContainer.appendChild(card.element);
    }
  }

  generateShuffledCardValues(totalCards) {
    const cardValues = [];

    for (let i = 1; i <= totalCards / 2; i++) {
      cardValues.push(i, i);
    }

    for (let i = cardValues.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [cardValues[i], cardValues[randomIndex]] = [
        cardValues[randomIndex],
        cardValues[i],
      ];
    }

    return cardValues;
  }

  checkCardsMatching() {
    if (this.openedCards[0].value === this.openedCards[1].value) {
      let el1 = document.getElementById(`card-${this.openedCards[0].id}`);
      let el2 = document.getElementById(`card-${this.openedCards[1].id}`);

      this.cards[this.openedCards[0].id].isCompleted = true;
      this.cards[this.openedCards[1].id].isCompleted = true;

      Sleep(1000).then(() => {
        el1.style.visibility = 'hidden';
        el2.style.visibility = 'hidden';

        const result = this.cards.filter((el) => {
          return el.isCompleted === false;
        });

        if (!result.length) {
          this.reset();
          setTimeout(() => {
            alert('You win');
            this.stop();
          }, 0);
        }
      });
    }
  }

  containerClicking(enableClick) {
    let gameContainer = document.getElementById(`game-container`);
    gameContainer.style.pointerEvents = enableClick ? 'auto' : 'none';
  }

  reset() {
    this.cards = [];
    this.openedCards = [];

    const gameContainer = document.getElementById('game-container');
    while (gameContainer.firstChild) {
      gameContainer.removeChild(gameContainer.firstChild);
    }
    this.containerClicking(false);
    this.timer.stop();
  }

  start() {
    this.generateGrid();
    this.containerClicking(true);
    this.timer.start();
  }

  stop() {
    this.reset();
    const timerElement = document.getElementById('timerDisplay');
    timerElement.textContent = 'Game finished!';
  }

  updateTimerDisplay(remainingTime) {
    const timerElement = document.getElementById('timerDisplay');
    timerElement.textContent = `Time remaining: ${remainingTime} seconds`;
  }

  onFinish() {
    setTimeout(() => {
      alert('You loose');
      this.stop();
    }, 0);
  }
}
