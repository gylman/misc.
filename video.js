'use strict';
const w = 2; // width
const h = 2; // height
const l = 100; // length
const videofile = [];
const makeFrame = () => {
  const frame = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = Math.floor(Math.random() * 2);
      frame.push({ x, y, c });
    }
  }
  return frame;
};

for (let frame = 0; frame < l; frame++) {
  videofile.push(makeFrame());
}

const sel = (str) => document.querySelector(str);

// const uncompressed = console.log(canvas);
const videoEl = sel('.video');

const frames = videofile.map((frame, i) => {
  if (frame[i].c === 1) {
  }
  return `
    <div class="frame">
      <div class="pixel ${dyn}" id="${0}></div>
      <div class="pixel ${dyn}" id="${1}></div>
      <div class="pixel ${dyn}" id="${2}></div>
      <div class="pixel ${dyn}" id="${3}></div>
    </div>
  `;
});
