import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function transformFilename(filename) {
    return capitalizeFirstLetter(
      filename
        .replace('glasses-', '')
        .replace('square-', '')
        .replace('-', ' ')
    );
  }

  const TraitsDisplay = ({ n, isUpdatingCanvas, delay }) => {
    const [noun, setNoun] = useState([]);

    useEffect(() => {
      setNoun(n);
    }, [n]);

    useEffect(() => {
      if(!isUpdatingCanvas) {
        const traits = document.querySelectorAll('.fc');
        setTimeout(() => {
          traits.forEach(t => {
            t.classList.remove('topAnim');
          });
        }, 0);
      }      
    }, [isUpdatingCanvas]);

  
    if (!noun.background) {
      return null;
    }


    return (
      <>
      <Fade bottom cascade opposite delay={0} when={!isUpdatingCanvas}>
      <ul className="traits">
<li className="fc">
  <div>
    <div className='bg' style={{ backgroundColor: `#${noun.background}` }} ></div>
  </div>
  <div>
    <span className='small'>Background</span>
    {noun.background === 'e1d7d5' && <span>Warm</span>}
    {noun.background === 'd5d7e1' && <span>Cool</span>}
  </div>
</li>
<li>
  <div className="trait" style={{ backgroundColor: `#${noun.background}` }} >
    <img src={"images/1-bodies/"+noun.parts[0].filename+".png"} alt={noun.parts[0].filename}/>
  </div>
  <div>
    <span className='small'>Body</span>
    {transformFilename(noun.parts[0].filename.replace('body-', ''))}
  </div>
</li>
<li>
  <div className="trait" style={{ backgroundColor: `#${noun.background}` }} >
    <img src={"images/2-accessories/"+noun.parts[1].filename+".png"} alt={noun.parts[1].filename} />
  </div>
  <div>
    <span className='small'>Accessory</span>
    {transformFilename(noun.parts[1].filename.replace('accessory-', ''))}
  </div>
</li>
<li>
  <div className="trait" style={{ backgroundColor: `#${noun.background}` }} >
    <img src={"images/3-heads/"+noun.parts[2].filename+".png"} alt={noun.parts[2].filename} />
  </div>
  <div>
    <span className='small'>Head</span>
    {transformFilename(noun.parts[2].filename.replace('head-', ''))}
  </div>
</li>
<li>
  <div className='trait' style={{ backgroundColor: `#${noun.background}` }} >
    <img src={"images/4-glasses/"+noun.parts[3].filename+".png"} alt={noun.parts[3].filename} />
  </div>
  <div>
    <span className='small'>Glasses</span>
    {transformFilename(noun.parts[3].filename.replace('glasses-', '').replace('square-', ''))}
  </div>
</li>
</ul>
</Fade>
      </>
    );
  };

  export default TraitsDisplay;