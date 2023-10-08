import React, { useState, useEffect, useMemo } from 'react';
import { NounsAuctionHouseABI } from '@nouns/sdk';
import { Alchemy, Network, Contract } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const Timer = () => {
  const providerPromise = useMemo(() => alchemy.config.getProvider(), []);
  const nounsContractPromise = useMemo(
    () =>
      providerPromise.then(provider =>
        new Contract("0x830BD73E4184ceF73443C15111a1DF14e495C706", NounsAuctionHouseABI, provider)
      ),
    [providerPromise]
  );
  const [endTimeInSeconds, setEndTimeInSeconds] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    const fetchAuctionData = async () => {
      const auctionContract = await nounsContractPromise;
      const auction = await auctionContract.auction();
      const endTimeInSeconds = parseInt(auction.endTime._hex, 16); // Convert hex to number
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const timeRemaining = endTimeInSeconds - currentTimeInSeconds;
      setEndTimeInSeconds(timeRemaining); // Set the end time in seconds
      setSecondsRemaining(timeRemaining);
    };

    fetchAuctionData(); // Call the async function
  }, [nounsContractPromise]);

  // Function to update the timer every second
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
