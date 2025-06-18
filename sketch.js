let img_source;
const sizePixel = 7;
const diameter = 200;

function setup() {
  createCanvas(800, 800);
  background(220);
  createImageInput();
}

function draw() {
  background(220);
  drawMaskedLayers();
}

/* 1 - Pixelate image */

/** @type {Graphics} */
let img_pixelated;

/**
 * 带圆形遮罩的像素化函数
 * @param {Image} img    输入图像
 * @param {number} size     像素块边长
 * @returns {Graphics}    像素化结果图形缓冲
 */
function pixelateImage(img, size) {
  const w = img.width;
  const h = img.height;

  // 先计算所有像素块的颜色
  const cols = floor(w / size);
  const rows = floor(h / size);

  let pix = [];
  for (let i = 0; i < cols; i++) {
    pix[i] = [];
    for (let j = 0; j < rows; j++) {
      let cx = i * size + size * 0.5;
      let cy = j * size + size * 0.5;
      let c = img.get(cx, cy);
      let L = brightness(c);
      pix[i][j] = L > 50 ? color("white") : color(0, 102, 204);
    }
  }

  // 创建输出缓冲
  let output = createGraphics(w, h);
  output.noStroke();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * size;
      let y = j * size;
      output.fill(pix[i][j]);
      output.rect(x, y, size, size);
    }
  }

  return output;
}

/* 2 - Livelli */

let inverted = false;

/** @type {Image|Graphics} */
let layer_up;
/** @type {Image|Graphics} */
let layer_down;

function mousePressed() {
  if (inverted == true) {
    layer_up = img_source;
    layer_down = img_pixelated;
    inverted = false;
  } else {
    layer_up = img_pixelated;
    layer_down = img_source;
    inverted = true;
  }
}

/* 3 - Image loading */

/** @type {FileInput} */
let imageInput;

function createImageInput() {
  // 创建文件输入元素用于选择图像
  imageInput = createFileInput(handleFile);
}

function handleFile(file) {
  // 仅当文件类型为图像时加载
  if (file.type === "image") {
    loadImage(file.data, (loadedImage) => {
      //
      img_source = loadedImage;
      img_source.resize(width, 0); // 按画布宽度调整大小
      //
      img_pixelated = pixelateImage(img_source, sizePixel);
      //
      layer_down = img_source;
      layer_up = img_pixelated;
    });
  } else {
    console.log("不支持的文件类型：", file.type);
  }
}

/* 4 - Maschere */

/**
 * 根据 showInside 标志和当前鼠标位置，
 * 在圆内/圆外分别显示原图或像素化图像。
 */
function drawMaskedLayers() {
  if (layer_down) {
    image(layer_down, 0, 0);
  }
  if (layer_up) {
    push();
    beginClip();
    ellipse(mouseX, mouseY, diameter);
    endClip();
    image(layer_up, 0, 0);
    pop();
  }
}
