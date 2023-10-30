import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas} from '@react-three/fiber';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { Frame } from './components/Frame.js'
import Timer from './components/Timer.js'
import Fade from 'react-reveal/Fade';
import { componentToHex, rgbToHex, extractColors, png } from './utils/utils.js'
import { captureScreenshot } from './utils/screenshot.js'
import TraitsDisplay from './utils/traitsDisplay.js';
// import saveImage from './utils/saveImage.js';
import moment from 'moment';
import { useNounsContext } from './utils/NounsContext';

const Hybrid = () => {
  const { nounData, loadingText, todayId, setTodayId, yesterdayId, setYesterdayId, totalSupply, fillArray } = useNounsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchData, setFetchData] = useState();
  const [init, setInit] = useState(false);
  const canvasRef = useRef(null);
  const [isUpdatingCanvas, setIsUpdatingCanvas] = useState(true);
  const [delay, setDelay] = useState(1500);

  useEffect(() => {

    if (nounData.length == 0) {
      setIsLoading(true);
    }

    setFetchData(true)

  }, []);

  const checkFileExists = async (i) => {
    const response = await fetch(`images/HBN/HBN_${i - 1}-${i}.png`);
    console.log(response)
    if (response.status === 200) {
      const filename = `HBN_${i - 1}-${i}`;
      // saveImage(canvasRef, filename);
    }
  };

  useEffect(() => {
    if (nounData.length > 0) {
      setFetchData(false)
    }
  }, [nounData]);

  useEffect(() => {
    if (fetchData === false && init === false) {
      setTimeout(() => {
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => {
            document.querySelector('.l').classList.add('inactive');
            document.querySelector('.r').classList.add('inactive');
            setIsUpdatingCanvas(false);
            setInit(true)
            // checkFileExists(todayId);

            // HACK
            setTimeout(() => {
              document.querySelector('.l').classList.add('white');
              document.querySelector('.r').classList.add('white');
            }, 1500);
          }, 200);
        }, 300);
      }, 1000);
    }
  }, [fetchData]);

  const handleLoader = () => {
    const bgElements = document.querySelectorAll('.bg, .trait');
    bgElements.forEach(bg => {
      bg.classList.add('is-loading');
    });
    const imgElements = document.querySelectorAll('.traits img');
    imgElements.forEach(img => {
      img.classList.add('pending');
    });
  }

  const middleLoader = () => {

    const middleLoaderElement = document.getElementById('middle-loader');
    setTimeout(() => {
      const bgElements = document.querySelectorAll('.bg, .trait');
      bgElements.forEach(bg => {
        bg.classList.remove('is-loading');
      });
      const imgElements = document.querySelectorAll('.traits img');
      imgElements.forEach(img => {
        img.classList.remove('pending');
      });
    }, 100);

    setTimeout(() => {
      setTimeout(() => {
        document.getElementById('canvas').classList.remove('inactive')
      }, 700);
      middleLoaderElement.classList.remove('active');
      setIsUpdatingCanvas(false);

    }, 1000);
  }

  const leftLoader = () => {
    const leftLoaderElement = document.getElementById('left-loader');
    setTimeout(() => {
      const bgElements = document.querySelectorAll('.bg, .trait');
      bgElements.forEach(bg => {
        bg.classList.remove('is-loading');
      });
      const imgElements = document.querySelectorAll('.traits img');
      imgElements.forEach(img => {
        img.classList.remove('pending');
      });
    }, 100);

    setTimeout(() => {
      setTimeout(() => {
        document.getElementById('canvas').classList.remove('inactive')
      }, 700);
      leftLoaderElement.classList.remove('active');
      setIsUpdatingCanvas(false);
    }, 1000);
  }

  const previous = () => {
    document.getElementById('canvas').classList.add('inactive')

    if (yesterdayId >= 1) {
      document.getElementById('middle-loader').classList.add('active');

      setIsUpdatingCanvas(true);
      const traits = document.querySelectorAll('.fc');
      traits.forEach(t => {
        t.classList.add('topAnim');
      });
      handleLoader()
      setTimeout(() => {

        if (nounData[yesterdayId - 1]) {
          setTodayId(prevTodayId => prevTodayId - 1);
          setYesterdayId(prevYesterdayId => prevYesterdayId - 1);
        }

        if (nounData[yesterdayId - 2]) {
          fillArray()
        }

        middleLoader()
      }, 500);
    }
  };

  const next = () => {
    document.getElementById('canvas').classList.add('inactive')

    if (todayId < totalSupply - 1) {
      document.getElementById('left-loader').classList.add('active');;

      setIsUpdatingCanvas(true);
      const traits = document.querySelectorAll('.fc');
      traits.forEach(t => {
        t.classList.add('topAnim');
      });
      handleLoader()
      setTimeout(() => {
        setTodayId(prevTodayId => prevTodayId + 1);
        setYesterdayId(prevYesterdayId => prevYesterdayId + 1);
        leftLoader()
      }, 500);
    }
  };

  return (
    <Suspense fallback={<div></div>}>
      {isLoading ? (
        <div className='loading-container'>
          <Fade top opposite delay={900} when={fetchData}>
            <span>{loadingText}</span>
          </Fade>
        </div>
      ) : (
        <>
          <div className="nouns-info">
            <div>
              <div id="hybrid" className="canvasContainer">    <div id="left-loader"></div>
                <div id="middle-loader"></div>

                <Canvas ref={canvasRef} id="canvas"
                  gl={{ preserveDrawingBuffer: true }}
                  dpr={[1, 2]}
                  camera={{ position: [0, 0, 8.673269879789604] }}
                  onCreated={(state) => {
                    const canvasContainer = canvasRef.current.parentElement;
                    const canvas = state.gl.domElement;
                
                    const aspect = 1;
                
                    const resizeRenderer = () => {
                      const width = canvasContainer.clientWidth;
                      const height = width / aspect;
                      canvas.style.width = `${width}px`;
                      canvas.style.height = `${height}px`;
                      canvas.width = width * window.devicePixelRatio;
                      canvas.height = height * window.devicePixelRatio;
                    };
                
                    window.addEventListener('resize', resizeRenderer);
                    resizeRenderer();
                
                    const composer = new EffectComposer(state.gl);
                    const renderPixelatedPass = new RenderPixelatedPass(1, canvasRef.current, state.camera);
                    renderPixelatedPass.depthEdgeStrength = 0;
                    renderPixelatedPass.normalEdgeStrength = 0;
                    composer.addPass(renderPixelatedPass);
                    composer.addPass(new ShaderPass(GammaCorrectionShader));
                    canvasRef.current.renderer = state.gl;
                  }}
                >
                  <ambientLight intensity={3.35} />
                  <Frame colorsNoun1={nounData[todayId]?.colors} colorsNoun2={nounData[yesterdayId]?.colors} />
                </Canvas>
              </div>
            </div>

            <div className="info">
              <div className='c'>

                <Fade top opposite delay={900}>
                  <h2>HBN <Fade top delay={350}>{yesterdayId}-{todayId}</Fade></h2>
                </Fade>
                <div className="playground">
                  <div id="playground-left">
                    <Fade bottom opposite delay={1100}>
                      <h3>Noun <Fade top delay={350}>{yesterdayId}</Fade></h3>
                    </Fade>
                    <TraitsDisplay n={nounData[yesterdayId]?.traits || []}
                      isUpdatingCanvas={isUpdatingCanvas}
                      delay={delay}
                    />
                  </div>
                  <div id="playground-right">
                    <Fade bottom opposite delay={1100}>
                      <h3>Noun <Fade top delay={350}>{todayId}</Fade></h3>
                    </Fade>
                    <TraitsDisplay n={nounData[todayId]?.traits || []}
                      isUpdatingCanvas={isUpdatingCanvas}
                      delay={delay}
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>

          <Fade bottom delay={1500}>
            <div className="footer-ui">
              <div>
                <div id="png">
                  <button id="saveJpg">save .jpg</button>
                </div>
              </div>
              <div></div>

              <div>
                <span id="previousLink" className={yesterdayId === 0 ? 'disabled' : ''}>
                  <a onClick={() => (previous())}>&larr;</a>
                </span>
                <span id="nextLink" className={todayId === totalSupply - 1 ? 'disabled' : ''}>
                  <a onClick={() => (next())}>&rarr;</a>
                </span>
                {todayId === totalSupply - 1
                  ? moment().format('MMMM D, YYYY')
                  : moment().subtract(totalSupply - todayId - 1, 'days').format('MMMM D, YYYY')}
              </div>
              <div className='timer-container'>
                Next Hybrid in <Timer />
              </div>
            </div>
          </Fade>
        </>
      )}
    </Suspense>
  )
};

export default Hybrid;