import draw from './draw.js';

class SketchPad {
    constructor(canvasContainer, size = 400) {
      this.canvas = document.createElement('canvas');
      canvasContainer.appendChild(this.canvas);
      this.canvas.width = size;
      this.canvas.height = size;
      this.ctx = this.canvas.getContext('2d');
      this.canvas.style = `
        background-color: #ffffff;
        box-shadow: 0 0 10px 2px;
      `;
      this.paths = [];
      this.isDrawing = false;
      this.#addEventListeners();
    }

    #addEventListeners() {
      this.canvas.addEventListener('mousedown', this.#mouseDown.bind(this));
      this.canvas.addEventListener('mousemove', this.#mouseMove.bind(this));
      this.canvas.addEventListener('mouseup', this.#mouseUp.bind(this));
      this.canvas.addEventListener('touchstart', this.#mouseDown.bind(this));
      this.canvas.addEventListener('touchmove', this.#mouseMove.bind(this));
      this.canvas.addEventListener('touchend', this.#mouseUp.bind(this));
    }

    #mouseDown(e) {
      if(e.touches[0]) {
        e = e.touches[0];
      }
      this.paths.push([this.#getMouse(e)]);
      this.isDrawing = true;
    }

    #mouseMove(e) {
      if(e.touches[0]) {
        e = e.touches[0];
      }
      if (this.isDrawing) {
        this.paths.at(-1).push(this.#getMouse(e));
        this.#reDraw();
      }
    }

    #mouseUp() {
      this.isDrawing = false;
    }

    #getMouse(e){
      const rect = this.canvas.getBoundingClientRect();
      return [
        e.clientX - rect.left,
        e.clientY - rect.top
      ];
    }

    #reDraw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      draw.paths(this.ctx, this.paths);
    }
}

const sketchPad = new SketchPad(sketchPadContainer);