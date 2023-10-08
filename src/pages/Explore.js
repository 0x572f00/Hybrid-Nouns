import React, {useEffect, useState} from 'react';
import { useNounsContext } from '../utils/NounsContext';
import Fade from 'react-reveal/Fade';

const Explore = () => {
  const { nounData } = useNounsContext();
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    if (nounData.length > 0 ) {
      setTotalSupply(nounData.length)
      console.log(nounData.length)
    }
  }, [nounData]);

    return (
      <>
      <div id="exploreHero">
        {/* <Fade top> */}
          <h2>
            EXPLORE <span>{totalSupply}</span> HYBRID NOUNS
          </h2>
        {/* </Fade> */}
      </div>
      <Fade bottom cascade>
      <ul id="explore">
       {Array.from({ length: totalSupply }, (_, index) => (
        <li key={index}>
          <a href={`/?hbn=${index}-${index + 1}`}>
            <img
              src={`images/HBN/small/HBN_${index}-${index + 1}.png`}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "images/HBN/small/HBN_0-1.png";
              }}
              alt={`HBN ${index}-${index + 1}`}
            />
            <span>
              HBN {index}-{index + 1}
            </span>
          </a>
        </li>
      ))}
      </ul>
      </Fade>
      </>

    );

}

export default Explore;