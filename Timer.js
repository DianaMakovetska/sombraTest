export class CountdownTimer {
  constructor(duration, updateTimerDisplay, onFinish) {
    this.duration = duration;
    this.timeLeft = duration;
    this.updateTimerDisplay = updateTimerDisplay;
    this.onFinish = onFinish;
    this.intervalId = null;
    this.isWorking = false;
  }

  start() {
    this.timeLeft = this.duration;
    this.isWorking = true;
    this.update();
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000);
  }

  stop() {
    this.isWorking = false;
    clearInterval(this.intervalId);
  }

  pause() {
    clearInterval(this.intervalId);
  }

  reset(duration) {
    this.timeLeft = duration;
    this.update();
  }

  resume() {
    this.isWorking = true;
    this.update();
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000);
  }

  update() {
    if (typeof this.updateTimerDisplay === 'function') {
      this.updateTimerDisplay(this.timeLeft);
    }
    if (this.timeLeft <= 0) {
      this.stop();
      if (typeof this.onFinish === 'function') {
        this.onFinish();
      }
    } else {
      this.timeLeft--;
    }
  }
}
