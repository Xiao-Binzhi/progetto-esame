let img_source;

let risultatoPixelato;
const sizePixel = 7;
const diameter = 200;

let showInside = false; // 切换模式：false 为外部像素化，true 为内部像素化

function setup() {
  createCanvas(800, 800);
  background(220);
  createImageInput();
}

function draw() {
  background(220);
  if (layer_down) {
    image(layer_down, 0, 0);
  }
  if (layer_up) {
    image(layer_up, 0, 0);
  }
  // if (img_source) {
  //   // 根据模式绘制不同像素化效果
  //   risultatoPixelato = pixelateImage(img_source, sizePixel, showInside);
  //   image(risultatoPixelato, 0, 0);
  // } else {
  //   // 提示用户选择图像
  //   fill(0);
  //   textSize(16);
  //   text("请在上方选择一个图像文件以开始。", 20, 60);
  // }
}

/**
 * 带圆形遮罩的像素化函数
 * @param {Image} img    输入图像
 * @param {number} size     像素块边长
 * @param {boolean} inside  模式：true 在圆内像素化，false 在圆外像素化
 * @returns {Graphics}    像素化结果图形缓冲
 */
// function pixelateImage(img, size, inside) {
//   const w = img.width;
//   const h = img.height;
//   const radius = diameter / 2;

//   // 先计算所有像素块的颜色
//   const cols = floor(w / size);
//   const rows = floor(h / size);
//   let pix = [];
//   for (let i = 0; i < cols; i++) {
//     pix[i] = [];
//     for (let j = 0; j < rows; j++) {
//       let cx = i * size + size * 0.5;
//       let cy = j * size + size * 0.5;
//       let c = img.get(cx, cy);
//       let L = brightness(c);
//       pix[i][j] = L > 50 ? color("white") : color(0, 102, 204);
//     }
//   }

//   // 创建输出缓冲
//   let output = createGraphics(w, h);
//   // 如果内部模式，先画原图背景；否则使用圆形遮罩显示原图
//   if (inside) {
//     output.image(img, 0, 0);
//   } else {
//     // 外部模式：在缓冲中先绘制圆形蒙版后的原图
//     let maskImg = img.get();
//     let m1 = createGraphics(w, h);
//     m1.background(0);
//     m1.fill(255);
//     m1.noStroke();
//     m1.circle(mouseX, mouseY, diameter);
//     maskImg.mask(m1);
//     output.image(maskImg, 0, 0);
//   }

//   // 绘制像素块
//   output.noStroke();
//   for (let i = 0; i < cols; i++) {
//     for (let j = 0; j < rows; j++) {
//       let x = i * size;
//       let y = j * size;
//       let cx = x + size * 0.5;
//       let cy = y + size * 0.5;
//       let d = dist(cx, cy, mouseX, mouseY);
//       if (inside) {
//         // 圆内像素化
//         if (d < radius) {
//           output.fill(pix[i][j]);
//           output.rect(x, y, size, size);
//         }
//       } else {
//         // 圆外像素化
//         if (d > radius) {
//           output.fill(pix[i][j]);
//           output.rect(x, y, size, size);
//         }
//       }
//     }
//   }
//   return output;
// }

/* 2 - Pixelate image */

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

/* 3 - Livelli */

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

/* 1 - Image loading */

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
