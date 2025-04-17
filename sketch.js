let video;
let cols = 64;
let rows = 48;
let scl = 10;
let cellW, cellH;

let shapeSelector, shapeColorPicker, bgColorPicker;
let textInput, fontSelector, textColorPicker;
let textXSlider, textYSlider, textSizeSlider;
let darkSizeSlider, lightSizeSlider;

function setup() {
  createCanvas(cols * scl, rows * scl);
  video = createCapture(VIDEO);
  video.size(cols, rows);
  video.hide();

  cellW = width / cols;
  cellH = height / rows;

  noStroke();
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont("monospace");

  // Shape Controls
  shapeSelector = createSelect();
  shapeSelector.position(10, height + 10);
  shapeSelector.option('circle');
  shapeSelector.option('asterisk');
  shapeSelector.option('dot');
  shapeSelector.option('star');
  shapeSelector.option('diamond');
  shapeSelector.option('flower');
  shapeSelector.option('flower2');
  shapeSelector.option('heart');
  shapeSelector.option('bubble');

  shapeColorPicker = createColorPicker('#00ff66');
  shapeColorPicker.position(140, height + 10);

  bgColorPicker = createColorPicker('#000000');
  bgColorPicker.position(220, height + 10);

  // Text Controls
  textInput = createInput('Hello Hasti!');
  textInput.position(10, height + 50);
  textInput.size(120);

  fontSelector = createSelect();
  fontSelector.position(140, height + 50);
  fontSelector.option('monospace');
  fontSelector.option('sans-serif');
  fontSelector.option('serif');

  textColorPicker = createColorPicker('#ffffff');
  textColorPicker.position(240, height + 50);

  textXSlider = createSlider(0, width, width / 2);
  textXSlider.position(10, height + 90);
  textXSlider.style('width', '150px');

  textYSlider = createSlider(0, height, height - 20);
  textYSlider.position(180, height + 90);
  textYSlider.style('width', '150px');

  textSizeSlider = createSlider(8, 72, 24);
  textSizeSlider.position(360, height + 50);
  textSizeSlider.style('width', '100px');

  // Shape Size Sliders
  darkSizeSlider = createSlider(2, cellW * 1.5, cellW * 0.8);
  darkSizeSlider.position(10, height + 130);
  darkSizeSlider.style('width', '150px');

  lightSizeSlider = createSlider(0.5, cellW * 0.8, 2);
  lightSizeSlider.position(180, height + 130);
  lightSizeSlider.style('width', '150px');
}

function draw() {
  background(bgColorPicker.color());
  video.loadPixels();

  let shapeMax = darkSizeSlider.value();
  let shapeMin = lightSizeSlider.value();

  if (video.pixels.length > 0) {
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        let index = (x + y * video.width) * 4;
        let r = video.pixels[index];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        let bright = (r + g + b) / 3;

        let radius = map(bright, 0, 255, shapeMax, shapeMin);
        let cx = x * cellW + cellW / 2;
        let cy = y * cellH + cellH / 2;

        fill(shapeColorPicker.color());
        textSize(radius * 1.8);
        let shape = shapeSelector.value();

        if (shape === 'circle') {
          ellipse(cx, cy, radius, radius);
        } else if (shape === 'asterisk') {
          text("✸", cx, cy);
        } else if (shape === 'dot') {
          text("●", cx, cy);
        } else if (shape === 'star') {
          text("✦", cx, cy);
        } else if (shape === 'diamond') {
          text("◆", cx, cy);
        } else if (shape === 'flower') {
          text("❊", cx, cy);
        } else if (shape === 'flower2') {
          text("✿", cx, cy);
        } else if (shape === 'heart') {
          text("❤︎", cx, cy);
        } else if (shape === 'bubble') {
          text("🫧", cx, cy);
        }
      }
    }
  }

  // Overlay Text
  fill(textColorPicker.color());
  textFont(fontSelector.value());
  textSize(textSizeSlider.value());
  text(textInput.value(), textXSlider.value(), textYSlider.value());
}
