import React from 'react';
import Fade from 'react-reveal/Fade';

const TagLine = () => {
  return (
    <div className="tagline">
    <Fade top delay={1450}> 
          <span>One Hybrid Noun, everyday…</span>
    </Fade>
    <Fade top delay={1450}>
          <span>Forever.</span>
    </Fade>
  </div>
  );
};

export default TagLine;