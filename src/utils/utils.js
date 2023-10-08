  export  function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  
  export function extractColors(imageData, colorsArray) {
    for (let i = 0; i < imageData.data.length; i += 4) {
      const [r, g, b] = imageData.data.slice(i, i + 3);
      colorsArray.push(rgbToHex(r, g, b));
    }
  }
  
  export function png() {
      var canvas = document.getElementById('canvas').children[0].children[0].toDataURL().replace("image/png", "image/octet-stream")
      document.getElementById('pngLink').setAttribute("href", canvas);
  }

