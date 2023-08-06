export class WindowResizeAdjuster {
  offsetTop: number;
  running: boolean;
  timeout: number;

  constructor() {
    this.offsetTop = 0;
    this.running = false;
    this.timeout = 0;
  }

  disengage() {
    this.running = false;
    window.clearTimeout(this.timeout);
  }

  engage(timeout = Infinity) {
    this.disengage();

    this.running = true;
    this.handler();

    if (timeout < Infinity) {
      this.timeout = window.setTimeout(() => this.disengage(), timeout);
    }
  }

  handler() {
    if (this.running) {
      const { height, top } = document.documentElement.getBoundingClientRect();

      if (height != window.innerHeight) {
        document.documentElement.style.height = `${window.innerHeight}px`;
      }
      if (top != 0) {
        this.offsetTop -= top;
        document.documentElement.style.top = `${this.offsetTop}px`;
      }

      window.requestAnimationFrame(() => this.handler());
    }
  }

  reset() {
    this.disengage();
    this.offsetTop = 0;
    document.documentElement.style.height = '';
    document.documentElement.style.top = '';
  }
}
