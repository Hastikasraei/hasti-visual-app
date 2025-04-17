let video;
let cols = 64;
let rows = 48;
let scl = 10;
let cellW, cellH;

let shapeSelector, shapeColorPicker, bgColorPicker;
let textInput, fontSelector, textColorPicker;
let textXSlider, textYSlider, textSizeSlider;
let darkSizeSlider, lightSizeSlider;

let speechXSlider, speechYSlider, speechSizeSlider;
let speechText = "";
let speechRec;

let speechTextColorPicker, clearSpeechButton;

let ui;

function setup() {
  createCanvas(720, 720);
  video = createCapture(VIDEO, () => video.size(cols, rows));
  video.hide();

  cellW = width / cols;
  cellH = height / rows;

  noStroke();
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont("monospace");

  ui = createDiv().addClass('ui-container');
  ui.style('display', 'flex');
  ui.style('flexDirection', 'column');
  ui.style('justifyContent', 'flex-start');
  ui.style('alignItems', 'flex-start');
  ui.style('gap', '6px');
  ui.style('padding', '16px');
  ui.style('background', 'rgba(255, 255, 255, 0.05)');
  ui.style('border-right', '1px solid rgba(255, 255, 255, 0.7)');
  ui.style('position', 'fixed');
  ui.style('top', '0');
  ui.style('left', '0');
  ui.style('height', '100%');
  ui.style('width', '200px');
  ui.style('zIndex', '10');

  const controls = [
    shapeSelector = createSelect(),
    shapeColorPicker = createColorPicker('#ffff00'),
    bgColorPicker = createColorPicker('#000000'),
    textInput = createInput(''),
    fontSelector = createSelect(),
    textColorPicker = createColorPicker('#ffffff'),
    textXSlider = createSlider(0, width, width / 2),
    textYSlider = createSlider(0, height, height - 40),
    textSizeSlider = createSlider(8, 72, 24),
    darkSizeSlider = createSlider(10, 80, 40),
    lightSizeSlider = createSlider(1, 20, 5),
    speechXSlider = createSlider(0, width, width / 2),
    speechYSlider = createSlider(0, height, 40),
    speechSizeSlider = createSlider(10, 72, 18)
  ];

  controls.forEach(ctrl => {
    ctrl.parent(ui);
    ctrl.style('font-size', '10px');
    ctrl.style('height', '20px');
    ctrl.style('width', '150px');
    ctrl.style('color', '#ffff00');
    ctrl.style('background', 'transparent');
    ctrl.style('border', 'none');
    ctrl.style('padding', '2px');
  });

  const sliders = [
    textXSlider, textYSlider, textSizeSlider,
    darkSizeSlider, lightSizeSlider,
    speechXSlider, speechYSlider, speechSizeSlider
  ];

  const sliderLabels = [
    "Text X Position",
    "Text Y Position",
    "Text Size",
    "Dark Pixel Max Size",
    "Light Pixel Min Size",
    "Speech X Position",
    "Speech Y Position",
    "Speech Text Size"
  ];

  sliders.forEach((slider, i) => {
    const wrapper = createDiv().addClass('slider-wrapper').parent(ui);
    wrapper.style('position', 'relative');
    wrapper.style('width', '150px');
    wrapper.style('height', '36px');
    wrapper.style('display', 'flex');
    wrapper.style('flexDirection', 'column');
    wrapper.style('justifyContent', 'center');

    const sliderLine = createDiv().addClass('slider-line').parent(wrapper);
    sliderLine.style('position', 'absolute');
    sliderLine.style('top', '50%');
    sliderLine.style('left', '0');
    sliderLine.style('width', '100%');
    sliderLine.style('height', '1px');
    sliderLine.style('background', 'white');
    sliderLine.style('transform', 'translateY(-0.5px)');
    sliderLine.style('pointer-events', 'none');

    slider.parent(wrapper);
    slider.style('position', 'relative');
    slider.style('z-index', '1');
    slider.style('width', '100%');
    slider.style('height', '20px');
    slider.elt.classList.add('custom-slider');

    const label = createDiv(sliderLabels[i]).parent(wrapper);
    label.style('font-size', '10px');
    label.style('color', 'white');
    label.style('margin-top', '2px');
    label.style('text-align', 'left');
  });

  // 🎤 Speech text color picker
  speechTextColorPicker = createColorPicker('#ffffff').parent(ui);
  speechTextColorPicker.style('width', '150px');
  const speechColorLabel = createDiv("Speech Text Color").parent(ui);
  speechColorLabel.style('font-size', '10px');
  speechColorLabel.style('color', 'white');
  speechColorLabel.style('text-align', 'left');
  speechColorLabel.style('margin-top', '-10px');

  // ❌ Clear speech text button
  clearSpeechButton = createButton("Clear Speech Text").parent(ui);
  clearSpeechButton.mousePressed(() => {
    speechText = "";
  });
  clearSpeechButton.style('margin-top', '6px');
  clearSpeechButton.style('font-size', '10px');
  clearSpeechButton.style('padding', '4px');
  clearSpeechButton.style('width', '150px');
  clearSpeechButton.style('background', 'rgba(255,255,255,0.2)');
  clearSpeechButton.style('color', 'white');
  clearSpeechButton.style('border', '1px solid white');
  clearSpeechButton.style('cursor', 'pointer');

  shapeSelector.option('circle');
  shapeSelector.option('asterisk');
  shapeSelector.option('dot');
  shapeSelector.option('star');
  shapeSelector.option('diamond');
  shapeSelector.option('flower');
  shapeSelector.option('flower2');
  shapeSelector.option('heart');
  shapeSelector.option('bubble');
  shapeSelector.option('cosmic');
  shapeSelector.option('smiley');
  shapeSelector.selected('circle');

  fontSelector.option('monospace');
  fontSelector.option('sans-serif');
  fontSelector.option('serif');

  let SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  if (SpeechRecognition) {
    speechRec = new SpeechRecognition();
    speechRec.continuous = true;
    speechRec.interimResults = true;
    speechRec.lang = 'en-US';
    speechRec.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          speechText += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
    };
    speechRec.start();
  } else {
    console.warn("Speech Recognition not supported in this browser.");
  }
}

function draw() {
  background(bgColorPicker.color());
  video.loadPixels();

  if (video.pixels.length < 4) return;

  let shapeMax = darkSizeSlider.value();
  let shapeMin = lightSizeSlider.value();

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let bright = (r + g + b) / 3;

      // 💥 Boost contrast
      let contrastFactor = 1.5;
      bright = (bright - 128) * contrastFactor + 128;
      bright = constrain(bright, 0, 255);

      let radius = map(bright, 0, 255, shapeMax, shapeMin);
      let cx = x * cellW + cellW / 2;
      let cy = y * cellH + cellH / 2;

      fill(shapeColorPicker.color());
      textSize(radius * 1.8);
      let shape = shapeSelector.value();

      if (shape === 'circle') {
        ellipse(cx, cy, radius, radius);
      } else if (shape === 'asterisk') text("✸", cx, cy);
      else if (shape === 'dot') text("●", cx, cy);
      else if (shape === 'star') text("✦", cx, cy);
      else if (shape === 'diamond') text("◆", cx, cy);
      else if (shape === 'flower') text("❊", cx, cy);
      else if (shape === 'flower2') text("✿", cx, cy);
      else if (shape === 'heart') text("❤︎", cx, cy);
      else if (shape === 'bubble') text("🫧", cx, cy);
      else if (shape === 'cosmic') text("𖦹", cx, cy);
      else if (shape === 'smiley') text("☻", cx, cy);
    }
  }

  fill(textColorPicker.color());
  textFont(fontSelector.value());
  textSize(textSizeSlider.value());
  text(textInput.value(), textXSlider.value(), textYSlider.value());

  fill(speechTextColorPicker.color());
  textSize(speechSizeSlider.value());
  textAlign(CENTER);
  text(speechText.trim(), speechXSlider.value(), speechYSlider.value());
}
