// NounsContext.js
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Alchemy, Network, Contract, fromHex } from 'alchemy-sdk';
import { ImageData, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import { componentToHex, rgbToHex, extractColors, png } from '../utils/utils.js'

const NounsContext = createContext();

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(settings);
const nounsABI = require("../abi/nouns.json");
const nounsContractAddress = "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03";

export const useNounsContext = () => {
  return useContext(NounsContext);
};

export const extractColorsFromSVG = async (parts, background) => {
  const palette = ImageData.palette;
  const svgBinary = buildSVG(parts, palette, background);
  const svgBase64 = btoa(svgBinary);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const cv = document.createElement("canvas");
      cv.width = 32;
      cv.height = 32;
      const cn = cv.getContext("2d");
      cn.drawImage(img, 0, 0, 32, 32);
      const imgData = cn.getImageData(0, 0, 32, 32);
      const colorsArray = [];
      extractColors(imgData, colorsArray);
      resolve(colorsArray);
    };
    img.src = `data:image/svg+xml;base64,${svgBase64}`;
  });
};

export const NounsProvider = ({ children }) => {
  const [allTraitsFetched, setAllTraitsFetched] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [nounData, setNounData] = useState([]);
  const providerPromise = useMemo(() => alchemy.config.getProvider(), []);
  const nounsContractPromise = useMemo(() => providerPromise.then(provider => new Contract(nounsContractAddress, nounsABI, provider)), [providerPromise]);
  const [todayId, setTodayId] = useState(0);
  const [yesterdayId, setYesterdayId] = useState(0);


  const fetchAndExtractColors = async (id, traits) => {
    setTimeout(() => {
      setLoadingText(
        <span dangerouslySetInnerHTML={{ __html: 'extracting colors from SVG <div class="dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>' }} />
        );
    }, 1000);
    const cv = document.createElement("canvas");
    cv.width = 32;
    cv.height = 32;
    const cn = cv.getContext("2d");
  
    const { palette } = ImageData;
  
    const svgBinary = buildSVG(traits.parts, palette, traits.background);
    const svgBase64 = btoa(svgBinary);
    const img = new Image();
    img.crossOrigin = "Anonymous";
  
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        cn.drawImage(img, 0, 0, 32, 32);
        const imgData = cn.getImageData(0, 0, 32, 32);
        const colorsArray = [];
        await extractColors(imgData, colorsArray);
        resolve(colorsArray);
      };
  
      img.src = `data:image/svg+xml;base64,${svgBase64}`;
    });
  };

  const updateNounData = useCallback((newData) => {
    setNounData(newData);
  }, []);

  useEffect(() => {
    if (totalSupply === 0) {
      return;
    }

    const fetchTraitsPeriodically = async () => {
      if (allTraitsFetched) {
        return;
      }
        setLoadingText(
          <span dangerouslySetInnerHTML={{ __html: 'fetching data and traits <div class="dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>' }} />
        );

      const nounsContract = await nounsContractPromise;
      const updatedNounData = [...nounData];
      const idsToUpdate = Array.from({ length: 5 }, (_, index) => totalSupply - 5 + index);

      for (let id of idsToUpdate) {
        if (id === totalSupply - 1) {
          setAllTraitsFetched(true);
        }
        if (!updatedNounData[id] || !updatedNounData[id].traits) {
          const seed = await nounsContract.seeds(id);
          const traits = await getNounData(seed);
          
          const colors = await extractColorsFromSVG(traits.parts, traits.background);
          
          updatedNounData[id] = { id, traits, colors };
      
          fetchAndExtractColors(id, traits);
        }
      }

      updateNounData(updatedNounData);
      clearInterval(fetchInterval);
    };

    const fetchInterval = setInterval(fetchTraitsPeriodically, 5000);
  }, [totalSupply, allTraitsFetched, nounsContractPromise, nounData, updateNounData]);

  useEffect(() => {
    const fetchDataAndTraits = async () => {
        try {

          setTimeout(() => {
            setLoadingText(
              <span dangerouslySetInnerHTML={{ __html: 'fetching nouns contract <div class="dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>' }} />
            );
          }, 1000);

            const contractMetadata = await alchemy.nft.getContractMetadata(nounsContractAddress);
            const fetchedTotalSupply = contractMetadata.totalSupply;
            
            setTotalSupply(fetchedTotalSupply);
            setTodayId(fetchedTotalSupply - 1)
            setYesterdayId(fetchedTotalSupply - 2)
        } catch (error) {
            console.error('Error fetching data and traits:', error);
        }
    };

    fetchDataAndTraits();
}, [nounsContractPromise]);

  const [loadingText, setLoadingText] = useState(<span dangerouslySetInnerHTML={{ __html: 'fetching nouns contract <div class="dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>' }} />);

  const fillArray = async () => {

    const nounsContract = await nounsContractPromise;
    const updatedNounData = [...nounData];
    const idsToUpdate = Array.from({ length: 5 }, (_, index) => todayId - 4 + index);

    for (let id of idsToUpdate) {
      if (!updatedNounData[id] || !updatedNounData[id].traits) {
        const seed = await nounsContract.seeds(id);
        const traits = await getNounData(seed);
        
        const colors = await extractColorsFromSVG(traits.parts, traits.background);
        
        updatedNounData[id] = { id, traits, colors };
    
        fetchAndExtractColors(id, traits);
      }
    }

    updateNounData(updatedNounData);
  };

  return (
    <NounsContext.Provider value={{ nounData, updateNounData, loadingText, todayId, setTodayId, yesterdayId, setYesterdayId, totalSupply, fillArray }}>
      {children}
    </NounsContext.Provider>
  );
};
