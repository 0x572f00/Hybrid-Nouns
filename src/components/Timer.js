import React, { useState, useEffect, useMemo } from 'react';
import { NounsAuctionHouseABI } from '@nouns/sdk';
import { Alchemy, Network, Contract } from 'alchemy-sdk';
import { ethers, AlchemyProvider } from 'ethers';

const Timer = () => {
  const [endTimeInSeconds, setEndTimeInSeconds] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    const fetchAuctionData = async () => {

      const provider = new ethers.AlchemyProvider('homestead', [process.env.REACT_APP_ALCHEMY_API_KEY]);
      const contract = new ethers.Contract('0x830BD73E4184ceF73443C15111a1DF14e495C706', NounsAuctionHouseABI, provider);
      const auction = await contract.auction();

      const endTimeInSeconds = parseInt(auction[3]);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const timeRemaining = endTimeInSeconds - currentTimeInSeconds;
      setEndTimeInSeconds(timeRemaining);
      setSecondsRemaining(timeRemaining);
    };

    fetchAuctionData();
  }, []);

  const updateTimer = () => {
    if (secondsRemaining <= 0) {
      setSecondsRemaining(endTimeInSeconds); // Reset seconds to end time
    } else {
      setSecondsRemaining(prevSeconds => prevSeconds - 1);
    }
  };

  useEffect(() => {
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval); // Cleanup on component unmount
  }, [endTimeInSeconds, secondsRemaining]);

  if (!endTimeInSeconds) {
    return null; // Render nothing until endTimeInSeconds is calculated
  }

  const daysRemaining = Math.floor(secondsRemaining / 86400);
  const hoursRemaining = Math.floor((secondsRemaining % 86400) / 3600);
  const minutesRemaining = Math.floor((secondsRemaining % 3600) / 60);
  const secondsDisplay = secondsRemaining % 60;

  return (
    <div className="timer">
      <span className="time">{hoursRemaining}</span>h&nbsp;
      <span className="time">{minutesRemaining}</span>m&nbsp;
      <span className="time">{secondsDisplay}</span>s
    </div>
  );
};

export default Timer;
