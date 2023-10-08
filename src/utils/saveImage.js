import * as THREE from "three"
import { create } from 'ipfs-http-client'; // Import the create function

const saveToIPFS = async (base64Data) => {
  try {
        const cid = "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn"
        const gatewayURL = 'http://k51qzi5uqu5dm2o6se5kavb221wlw1uil6zo4j47hyv9oupz1r3m57wsgnet4r.ipns.localhost:8080/';
      const ipfs = create({ url: gatewayURL })

    const { path } = await ipfs.add(base64Data);

    // Set the IPFS hash
    // setIpfsHash(path);

    console.log(path);
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
  }
};

const saveImage = (canvasRef,filename) => {

  const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
  console.log(canvasRef)
  console.log(canvasRef.current)
  const base64Data = renderer.domElement.toDataURL('image/png');

  saveToIPFS(base64Data);

};

export default saveImage;