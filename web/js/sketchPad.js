import draw from './draw.js';

class SketchPad {
  constructor (canvasContainer, size = 400) {
    this.canvas = document.createElement('canvas');
    canvasContainer.appendChild(this.canvas);
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style = `
        background-color: #ffffff;
        box-shadow: 0 0 10px 2px;
      `;
    
    this.undoBtn = document.createElement('button');
    this.undoBtn.textContent = 'Undo';
    this.undoBtn.style.display = 'block';
    this.undoBtn.style.textAlign = 'center';
    this.#reset();
    this.advanceBtn = document.getElementById('advanceBtn');
    this.student = document.getElementById('student');
    this.instruction = document.getElementById('instruction');
    canvasContainer.appendChild(this.undoBtn);
    this.#addEventListeners();

    this.data = {};
    window.data = this.data;
    this.index = undefined;
    this.labels = [ 'Car', 'Tree', 'House', 'Bicycle', 'Boat', 'Clock', 'Computer', 'Book', 'Pencil' ];
  }

  #reset() {
    this.paths = [];
    this.isDrawing = false;
    this.#reDraw();
  }

  #addEventListeners () {
    this.canvas.addEventListener('mousedown', this.#mouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.#mouseMove.bind(this));
    document.addEventListener('mouseup', this.#mouseUp.bind(this));
    this.canvas.addEventListener('touchstart', this.#mouseDown.bind(this), { passive: true });
    this.canvas.addEventListener('touchmove', this.#mouseMove.bind(this), { passive: true });
    document.addEventListener('touchend', this.#mouseUp.bind(this));

    this.undoBtn.addEventListener('click', () => {
      this.paths.pop();
      this.#reDraw();
    });

    this.advanceBtn.addEventListener('click', this.#start.bind(this));  
  }

  #mouseDown (e) {
    if (e.touches?.[ 0 ]) {
      e = e.touches[ 0 ];
    }
    this.paths.push([ this.#getMouse(e) ]);
    this.isDrawing = true;
  }

  #mouseMove (e) {
    if (e.touches?.[ 0 ]) {
      e = e.touches[ 0 ];
    }
    if (this.isDrawing) {
      this.paths.at(-1).push(this.#getMouse(e));
      this.#reDraw();
    }
  }

  #mouseUp () {
    this.isDrawing = false;
  }

  #getMouse (e) {
    const rect = this.canvas.getBoundingClientRect();
    return [
      e.clientX - rect.left,
      e.clientY - rect.top
    ];
  }

  #reDraw () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);
    if (this.paths.length > 0) {
      this.undoBtn.disabled = false;
    } else {
      this.undoBtn.disabled = true;
    }
  }

  #start () {
    if (this.index === undefined) {
      if (this.student.value?.trim() === '') {
        alert('Please enter your name before proceeding.');
        return;
      }
      this.data = {
        student: this.student.value,
        session: Date.now(),
        drawings: {}
      };
      this.student.style.display = 'none';
      this.index = 0;
      this.instruction.textContent = 'Draw the following: ' + this.labels[ this.index ];
      this.advanceBtn.textContent = 'Next';
      sketchPadContainer.style.visibility = 'visible';
    } else if (this.index < this.labels.length){
      console.log(this.data);
      if (this.paths.length === 0) {
        alert('Please draw something before processing');
        return;
      }
      const label = this.labels[ this.index ];
      this.data.drawings[ label ] = this.paths;
      this.index++;
      if (this.index < this.labels.length) {
        this.instruction.textContent = 'Draw the following: ' + this.labels[ this.index ];
        this.#reset();
      } else {
        this.instruction.textContent = 'Thank you for your drawings!';
        this.advanceBtn.textContent = 'SAVE';
        sketchPadContainer.style.visibility = 'hidden';
        console.log('Data collected:', JSON.stringify(this.data, null, 2));
        // Here you can send the data to a server or process it further
      }
    } else {
      const link = document.createElement('a');
      link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data, null, 2));
      link.download = 'sketchpad_data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.#reset();
      this.index = undefined;
    }

  }
}

const sketchPad = new SketchPad(sketchPadContainer);