import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import { addUserToFarm, getUserFromFarm } from '../utils/firestoreFunctions';
import FormattedTime from '../Component/FormattedTime';
import './bg.css';
import { ClipLoader } from 'react-spinners';
import coin from './log.png';
import coin2 from './logo.png';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState('7220649142'); 
  // const [userId, setUserId] = useState(null);

  const [userName, setUserName] = useState(null);
  const [buttonText, setButtonText] = useState("Start");
  const [showRCFarm, setShowRCFarm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState(null);


  // const ball = "1234";
  const prefix = "local";
  const [dynamicVariables, setDynamicVariables] = useState({});

  useEffect(() => {
    
    if (window.Telegram && window.Telegram.WebApp) {
      const { WebApp } = window.Telegram;
      WebApp.expand();
      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(JSON.stringify(user.id));
        setIdentity(user.id)
        setUserName(user.username);
        localStorage.setItem('localUserId', JSON.stringify(user.id));
        
      } else {
      //   const variableName = `${prefix}${userId}`;
      // const localData = localStorage.getItem(variableName);
      //   if (localData) {
      //     console.log(localData);
      //     setUserData(JSON.parse(localData));
      //   }
        console.error('User data is not available.');
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

 
  useEffect(() => {
   
    const fetchUserData = async () => {
      // await axios.get(`https://lunarapp.thelunarcoin.com/testbackend/api/squad/${userId}`);
      const variableName = `${prefix}${userId}`;
    //    window.localStorage.clear();
    // localStorage.clear();
    //   window.localStorage.removeItem(variableName);
    //  localStorage.removeItem(variableName);
      try {
         setLoading(true);
        let data = null;
        const localData = localStorage.getItem(variableName);
        console.log('this is local data '+ localData);

        if (localData) {
          data = JSON.parse(localData);
        } else {
          data = await getUserFromFarm(userId);
        }

        const currentTime = Math.floor(Date.now() / 1000);

        if (data) {
          const elapsed = currentTime - data.LastFarmActiveTime;
          const newFarmTime = data.FarmTime - elapsed;
          console.log('this is last active time '+ data.LastFarmActiveTime);
          console.log('this is current time '+ currentTime);
          console.log('this is farm time '+ data.FarmTime);
          console.log('this is farm status '+ data.FarmStatus);

          if ( data.FarmStatus !== 'farming') {
            if (newFarmTime <= 0 ){
              data = {
                ...data,
                FarmTime: 0,
                FarmReward: (Number(data.FarmReward) || 0) + (Number(data.FarmTime) || 0) * 0.1,
                LastFarmActiveTime: currentTime,
              };
              setButtonText("Claim");
            }
            else{
              data = {
                ...data,
                // UserId:data.userId,
                FarmBalance: data.FarmBalance,
                FarmReward: 0,
                FarmStatus: 'start',
                FarmTime: 300,
                
              };
          
              setButtonText("Start");
            }
           
          }
          else {
            data = {
              ...data,
              UserId:userId,
              FarmTime: newFarmTime,
              FarmReward: (Number(data.FarmReward) || 0) + (Number(elapsed) || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            };
            setButtonText("Farming...");
          }
          setUserData(data);
        } else {
          const initialData = {
            UserId:userId,
            FarmBalance: 0,
            FarmTime: 300,
            FarmReward: 0,
            LastFarmActiveTime: currentTime,
            StartFarmTime: currentTime,
          };
          await addUserToFarm(userId, initialData);
          setUserData(initialData);
        }
        setDynamicVariables(prevVariables => ({
          ...prevVariables,
          [variableName]: JSON.stringify(data)
        }));
        localStorage.setItem('localUserId', JSON.stringify(userId));

        localStorage.setItem(variableName, JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    let interval;
    if (buttonText === "Farming...") {
      // interval = setInterval(() => { 
        if (userData) {
          const currentTime = Math.floor(Date.now() / 1000);
          const elapsed = currentTime - userData.LastFarmActiveTime;
          const newFarmTime = userData.FarmTime - elapsed;
          
          if (newFarmTime <= 0) {
            setUserData((prevState) => ({
              ...prevState,
              FarmTime: 0,
              FarmReward: (Number(prevState.FarmReward) || 0) + (Number(prevState.FarmTime) || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            }));
            setButtonText("Claim");
          } else {
            setUserData((prevState) => ({
              ...prevState,
              FarmTime: newFarmTime,
              FarmReward: (Number(prevState.FarmReward) || 0) + (Number(elapsed) || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            }));
          } 
        }
      // }, 1000);
    }

    // return () => clearInterval(interval);
  }, [buttonText, userData]);

  useEffect(() => {
    const saveUserData = async () => {
      if (userId && userData) {
        const variableName = `${prefix}${userId}`;
        localStorage.setItem('localUserId', JSON.stringify(userId));

        localStorage.setItem(variableName, JSON.stringify(userData));
      }
    };

    const handleBeforeUnload = (e) => {
      saveUserData();
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    const saveInterval = setInterval(saveUserData, 10000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(saveInterval);
      saveUserData();
    };
  }, [userId, userData]);

  const handleButtonClick = async () => {
    if (buttonText === "Start") {
      setButtonText("Farming...");
      setUserData((prevState) => ({
        ...prevState,
        FarmStatus: 'farming',
        LastFarmActiveTime: Math.floor(Date.now() / 1000),
      }));
    } else if (buttonText === "Claim") {
      if (userData?.FarmReward > 0) {
        if (navigator.vibrate) {
          navigator.vibrate(500);
        }
        try {
          const newFarmBalance = (Number(Math.round(userData.FarmBalance)) || 0) + (Number(Math.round(userData.FarmReward)) || 0);
          const newUserData = {
            ...userData,
            UserId:userId,
            FarmBalance: newFarmBalance,
            FarmReward: 0,
            FarmStatus: 'start',
            FarmTime: 300,
          };
          const variableName = `${prefix}${userId}`;

          await addUserToFarm(userId, newUserData);
          setUserData(newUserData);
          setShowRCFarm(true);
          setTimeout(() => setShowRCFarm(false), 2000);
          setButtonText("Start");
          localStorage.setItem('localUserId', JSON.stringify(userId));

          localStorage.setItem(variableName, JSON.stringify(newUserData));
        } catch (error) {
          console.error('Error claiming reward:', error);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-cover text-white p-4">
        <div className="flex flex-col items-center space-y-4">
          <ClipLoader color="#FFD700" size={60} speedMultiplier={1} />
        </div>
      </div>
    );
  }

  const isValidNumber = (value) => typeof value === 'number' && !isNaN(value);

  return (
    <div className="min-h-screen bg-cover text-white flex flex-col items-center p-7 space-y-4">
    <div className="relative pt-6 mb-3 pb-">
      <img src={coin} alt="LAR Coin" className="w-63 h-60 rounded-full" />
    </div>
    <div className="flex flex-row justify-between items-center space-x-4">
      <p className="text-white font-bold text-xl">HI, {userName} - {userId}</p>
      <p className="text-golden-moon font-bold text-xl">
        { Math.round(userData.FarmBalance).toLocaleString()} <span className="text-golden-moon">LAR</span>
      </p>
    </div>

    <div className="bg-zinc-950 bg-opacity-80 text-card-foreground p-2 rounded-3xl w-full max-w-md text-center min-h-[20vh] flex flex-col justify-center space-y-4">
      <p className="text-zinc-400 text-xl ">Farming Points</p>
      <div className="flex items-center justify-center space-x-2">
        <img aria-hidden="true" alt="team-icon" src={coin2} className="mr-2" width="25" height="5" />
        <p className="text-4xl font-normal text-primary">
          {userData && isValidNumber(userData.FarmReward) ? userData.FarmReward.toFixed(1) : "0.0"} <span className="text-golden-moon">LAR</span>
        </p>
      </div>
      <p className="font-extrabold text-red-600"><FormattedTime time={userData?.FarmTime || 0}/></p>
      <div className="space-y-4 w-full flex items-center flex-col">
        <button
          className={`text-white hover:bg-secondary/80 px-6 py-3 rounded-xl w-full max-w-md  ${buttonText === "Farming..." ? "bg-zinc-800 bg-opacity-70" : "bg-gradient-to-r from-golden-moon"}`}
          onClick={handleButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>

    <div className="w-full max-w-md bg-zinc-900 fixed bottom-0 left-0 flex justify-around py-1">
      <Footer />
    </div>
  </div>
  );
};

export default Home; 