// We do not need to analyze all 1920x1080 pixels, let's build our model on 2x2 screen

const w = 2; // width
const h = 2; // height
const l = 150000; // length
const canvas = [];

// One frame

for (y = 0; y < h; y++) {
  for (x = 0; x < w; x++) {
    const [r, g, b] = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    canvas.push({ x, y, rgb: [r, g, b] });
  }
}

// Output:

/* 
    [
        { x: 0, y: 0, rgb: [ 29, 145, 97 ] },
        { x: 1, y: 0, rgb: [ 178, 1, 1 ] },
        { x: 0, y: 1, rgb: [ 55, 166, 173 ] },
        { x: 1, y: 1, rgb: [ 37, 94, 146 ] }
    ]
*/

// If pixel (0,0) is the same across ten frames, we do not need to make array of 10 tuples.
// We can make one tuple and attach the number of frames to it. Not all pixels change colors
// throughout z number of frames

// Let's say:
// (0,0) has color [ 29, 145, 97 ] for 10 frames
// (1,0) has color [ 178, 1, 1 ] for 5 frames
// We can just:
// 1. store the initial 2x2
// 2. store only the diffs

// Example
// We store the initial pixels, pixels, colors of pixels, number of frames with that color:
const video = [
  [
    { x: 0, y: 0, rgb: [29, 145, 97], z: 10 },
    { x: 1, y: 0, rgb: [178, 1, 1], z: 5 },
    { x: 0, y: 1, rgb: [55, 166, 173], z: 10 },
    { x: 1, y: 1, rgb: [37, 94, 146], z: 10 },
  ],
];

// (0,1) will change after 5 frames, so, the second element of the array will be only (0,1)
video = [
  [
    { x: 0, y: 0, rgb: [29, 145, 97], z: 10 },
    { x: 1, y: 0, rgb: [178, 1, 1], z: 5 },
    { x: 0, y: 1, rgb: [55, 166, 173], z: 10 },
    { x: 1, y: 1, rgb: [37, 94, 146], z: 10 },
  ],
  [{ x: 1, y: 0, rgb: [178, 1, 1], z: 5, z: 15 }],
];
// After another 5 frames, the other 3 pixels will again be added with new z values
video = [
  [
    { x: 0, y: 0, rgb: [29, 145, 97], z: 10 },
    { x: 1, y: 0, rgb: [178, 1, 1], z: 5 },
    { x: 0, y: 1, rgb: [55, 166, 173], z: 10 },
    { x: 1, y: 1, rgb: [37, 94, 146], z: 10 },
  ],
  [{ x: 1, y: 0, rgb: [178, 1, 1], z: 5, z: 15 }],
  [
    { x: 0, y: 0, rgb: [129, 45, 97], z: 2 },
    { x: 0, y: 1, rgb: [155, 16, 13], z: 4 },
    { x: 1, y: 1, rgb: [137, 194, 16], z: 8 },
  ],
];
// This way we can significantly reduce the video's size

// console.log(canvas);

// Let's create an algorithm for getting a series of 100 pics, and then store the new way, and then recover back
