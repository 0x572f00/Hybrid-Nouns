import * as THREE from "three"

const saveImage = (canvasRef,filename) => {

  const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
  const base64Data = renderer.domElement.toDataURL('image/png');
  console.log(base64Data);

  const url = 'https://hybridnouns.wtf/saveHybrid.php'; // Replace with the actual URL of your PHP file

  // Create a FormData object and append the base64 image data and filename to it
  const formData = new FormData();
  formData.append('imageData', base64Data);
  formData.append('filename', filename+'.png');

  fetch(url, {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error occurred while saving the image');
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response from the PHP file
      if (data.success) {
        console.log('Image saved successfully');
        console.log(data)
      } else {
        console.log('Image saving failed: ' + data.message);
      }
    })
    .catch((error) => {
      // Handle any errors
      console.error('Error:', error.message);
    });
};

export default saveImage;