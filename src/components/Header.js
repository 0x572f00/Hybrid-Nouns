import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import { useNounsContext } from '../utils/NounsContext';
import Darkmode from 'darkmode-js';

const darkmode = new Darkmode({
  showWidget: false,
  backgroundColor: 'transparent',
  mixColor: 'transparent'
});

const Header = () => {
  const { nounData, todayId, yesterdayId } = useNounsContext();
  const [todayColor, setTodayColor] = useState('#f3322c')
  const [yesterdayColor, setYesterdayColor] = useState('#f3322c')
  const location = useLocation();
  const navigate = useNavigate();

  const colorMappings = {
    'glasses-square-black-eyes-red': '#000',
    'glasses-square-black-rgb': '#000',
    'glasses-square-black': '#000',
    'glasses-square-blue': '#5648ed',
    'glasses-square-blue-med-saturated': '#2b83f6',
    'glasses-deep-teal': '#027c92',
    'glasses-square-frog-green': '#8dd122',
    'glasses-square-fullblack': '#000',
    'glasses-square-grey-light': '#9cb4b8',
    'glasses-square-green-blue-multi': '#257ced',
    'glasses-square-guava': '#e8705b',
    'glasses-grass': '#00a556',
    'glasses-hip-rose': '#ff638d',
    'glasses-square-honey': '#d19a54',
    'glasses-square-orange': '#fe500c',
    'glasses-square-magenta': '#b9185c',
    'glasses-square-pink-purple-multi': "#cc0595",
    'glasses-square-red': '#f3322c',
    'glasses-square-smoke': '#d7d3cd',
    'glasses-square-teal': '#4bea69',
    'glasses-square-watermelon': "#e8705b",
    'glasses-square-yellow-orange-multi': '#f98f30',
    'glasses-square-yellow-saturated': '#ffef16',
  };

  const setColors = (itemId, setColorFunction) => {
    const filename = nounData[itemId]['traits']['parts'][3].filename;
    const color = colorMappings[filename];
    if (color) {
      setColorFunction(color);
    }
  };

  useEffect(() => {

    if (nounData.length !== 0) {
      setColors(todayId, setTodayColor);
      setColors(yesterdayId, setYesterdayColor);
    }

  }, [nounData, todayId, yesterdayId]);

  const handleLink = (path) => {
    const links = document.querySelectorAll('.bigLink');
    links.forEach((link) => link.classList.remove('inactive'));

    setTimeout(() => {
      navigate(path);
      setTimeout(() => {
        links.forEach((link) => link.classList.add('inactive'));
      }, 1000);
    }, 1500);
  };

  return (
    <Fade top delay={500}>
      <header>
        <Fade top cascade delay={0}>
          <div>One Hybrid Noun, everyday…</div>
          <div>
            <a
              className={`bigLink ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => handleLink('/')}
            >
              <svg className="noggles" width="1083" height="406" viewBox="0 0 1083 406" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1_113)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M379 7.48157L339 0L312 7.48157L271 0L246 7.48157L203 0V135L181 139.5L136 135L113 139.5L68 135L47 139.5L0 135V338H47H68V203.5L113 206L136 203.5L181 206L203 203.5V406L246 404.5L271 406L312 404.5L339 406L379 404.5L407 406L445 404.5L474 406L511 404.5L542 406L577 404.5L610 406V203L643 206L676 203V406L709 404.5L744 406L775 404.5L812 406L841 404.5L879 406L907 404.5L947 406L974 404.5L1015 406L1040 404.5L1083 406V0L1040 7.48157L1015 0L974 7.48157L947 0L907 7.48157L879 0L841 7.48157L812 0L775 7.48157L744 0L709 7.48157L676 0V136L643 139.5L610 136V0L577 7.48157L542 0L511 7.48157L474 0L445 7.48157L407 0L379 7.48157Z" fill={yesterdayColor} />
                  <path fillRule="evenodd" clipRule="evenodd" d="M246 7.48157L271 0V406L246 404.5V7.48157ZM68 135L47 139.5V338H68V135ZM203 135L181 139.5V206L203 203.5V135ZM339 0L312 7.48157V404.5L339 406V0ZM379 7.48157L407 0V406L379 404.5V7.48157ZM474 0L445 7.48157V404.5L474 406V0ZM511 7.48157L542 0V406L511 404.5V7.48157ZM610 0L577 7.48157V404.5L610 406V0ZM113 139.5L136 135V203.5L113 206V139.5ZM907 7.48157L947 0V406L907 404.5V7.48157ZM879 0L841 7.48157V404.5L879 406V0ZM775 7.48157L812 0V406L775 404.5V7.48157ZM744 0L709 7.48157V404.5L744 406V0ZM643 139.5L676 136V203L643 206V139.5ZM1015 0L974 7.48157V404.5L1015 406V0ZM1040 7.48157L1083 0V406L1040 404.5V7.48157Z" fill={todayColor} />
                  <path fillRule="evenodd" clipRule="evenodd" d="M271 67L312 73.5L339 67L379 73.5L407 67L445 73.5L474 67L511 73.5L542 67V338H511H474H445H407H379H339H312H271V67ZM775 73.5L812 67L841 73.5L879 67L907 73.5L947 67L974 73.5L1015 67V338H974H947H907H879H841H812H775H744V67L775 73.5Z" fill="white" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M445 73.5L407 67V338H445H474H511H542V67L511 73.5L474 67L445 73.5ZM907 73.5L879 67V338H907H947H974H1015V67L974 73.5L947 67L907 73.5Z" fill="black" />
                </g>
                <defs>
                  <clipPath id="clip0_1_113">
                    <rect width="1083" height="406" fill="white" />
                  </clipPath>
                </defs>
              </svg>

            </a>
          </div>
          <div>
            {/* <a href="#" className="bigLink">
            Info
          </a> */}
            Forever.
          </div>
          <div>
            <button className="modeSwitch" onClick={() => darkmode.toggle()}>
              <img src="./images/icons/sun.svg" alt="lightmode" />
            </button>
          </div>
        </Fade>
      </header>
    </Fade>
  );
};

export default Header;
