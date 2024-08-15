import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import './Spinner.css';
import { ClipLoader } from 'react-spinners';
import { addUserTasks, getUserTasks,updateUserTasks, getTasks, updateFarmBalance, getUserFromFarm } from '../utils/firestoreFunctions';
import './bg.css';
import RCTasks from '../Component/RCTasks';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './logo.png';
import axios from 'axios';
import _ from 'lodash';

const Tasks = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null); // Replace with dynamic ID if possible
  const [taskFilter, setTaskFilter] = useState('new');
  const [loadingTask, setLoadingTask] = useState(null);
  const [tasks, setTasks] = useState([]); // Initialize as an empty array
  const [farmData, setFarmData] = useState(null);
  const [taskReadyToClaim, setTaskReadyToClaim] = useState(null);
  const [showRCTasks, setShowRCTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // New state for selected task
  const [showGoButton, setShowGoButton] = useState(false); // New state for showing "Go" button
  const [loading, setLoading] = useState(true); // New state for loading
  const [newFarmBalance, setNewFarmBalance] = useState(null);
  const prefix = "local";
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const { WebApp } = window.Telegram;
      WebApp.expand();
      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
      } else {
        const localUserId = localStorage.getItem('localUserId');
        const variableName = `${prefix}${userId}`;
        const localUserData = localStorage.getItem(variableName);
       
        if (localUserId) {
         
          const parsedData = JSON.parse(localUserId);
          setUserId(parsedData);
        }
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const localUserId = localStorage.getItem('localUserId');
        if (localUserId) {
          const parsedData = JSON.parse(localUserId);
          setUserId(parsedData);
        }
        const data = await getUserTasks(userId);
        const getTask = await getUserTasks(userId);
        if (data) {
          setUserData(data);
          setTasks(getTask);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const variableName = `${prefix}${userId}`;

    const localUserData = localStorage.getItem(variableName);
    console.log(newFarmBalance);
    if (newFarmBalance !== null && localUserData) {
      const parsedUserData = JSON.parse(localUserData);
      // Update the localStorage with the new FarmBalance
      
      const updatedUserData = { ...parsedUserData, FarmBalance: newFarmBalance };
      localStorage.setItem(variableName, JSON.stringify(updatedUserData));
      // Optionally update the state to reflect changes in the UI
      console.log('this  one'+ updatedUserData)
      // setUserData(updatedUserData);
    }
  }, [newFarmBalance]);

  useEffect(() => {
    const saveUserData = async () => {
      if (_.isEqual(userData, farmData)) {}
      else{
        try {
          await updateUserTasks(userId, userData);
          const dataz = await getUserTasks(userId);
        
            setUserData(dataz);
            setTasks(dataz);
            setFarmData(dataz)
        
        } catch (error) {
          console.error('Error saving data:', error);
        }
      }
    };

    const handleBeforeUnload = (e) => {
       saveUserData();
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    // const saveInterval = setInterval(saveUserData, 10000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // clearInterval(saveInterval);
      saveUserData();
      
    };
  }, [userId, userData]);

  const handleClaimClick = async (taskId, reward) => {
    setLoadingTask(taskId);
    if (navigator.vibrate) {
      navigator.vibrate(500);
    }
    setTimeout(() => {
      setLoadingTask(null);
      setTaskReadyToClaim(taskId);

    setUserData((prevData) => ({
      ...prevData,
      TasksComplete: {
        ...prevData.TasksComplete,
        [taskId]: true,
      },
    
      status: {
        ...prevData.status,
        'taskToChange': taskId,
        'statz': 'completed',
      },
    }));
    const variableName = `${prefix}${userId}`;
    const localUserData = localStorage.getItem(variableName);
      if (localUserData) {
        
        const parsedUserData = JSON.parse(localUserData);
        console.log('usdatess'+ parsedUserData)
        const updatedFarmBalance = Number(parsedUserData.FarmBalance) + Number(reward);

        console.log('usdatess'+ updatedFarmBalance)
        setNewFarmBalance(updatedFarmBalance);
      }
  }, 1000);
  
 
  };

  const handleStartClick = (taskId, link) => {
    setLoadingTask(taskId);
    window.open(link, '_blank');
    setTimeout(() => {
      setLoadingTask(null);
      setTaskReadyToClaim(taskId);
      setUserData((prevData) => ({
        ...prevData,
        status: {
          ...prevData.status,
          'taskToChange': taskId,
          'statz': 'claim',
        },
      }));
    }, 20000);
  };



  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'new') {
      return task.status !== 'completed';
    } else if (taskFilter === 'completed') {
      return task.status === 'completed';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-cover text-white p-4">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-white text-4xl font-normal">
            <ClipLoader color="#FFD700" size={60} speedMultiplier={1} />
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cover min-h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto text-center text-white p-4">
        <h1 className="text-2xl font-bold">
          Curious about the moon's secrets? <br />
          Complete tasks to find out!
        </h1>
        <p className="text-zinc-500 mt-2">
          But hey, only qualified actions unlock the <br />
          LAR galaxy! ✨
        </p>
        <div className="flex justify-center w-full mt-4">
        <button
          className={`py-2 bg-opacity-70 text-center text-sm w-full rounded-2xl ${
            taskFilter === 'new' ? 'bg-white text-black' : 'bg-zinc-950 text-zinc-400'
          }`}
          onClick={() => setTaskFilter('new')}
        >
          New
        </button>
        <button
          className={`bg-opacity-70 py-2 text-center text-sm w-full rounded-2xl ${
            taskFilter === 'completed' ? 'bg-white text-black' : 'bg-zinc-950 text-zinc-400'
          }`}
          onClick={() => setTaskFilter('completed')}
        >
          Completed
        </button>
      </div>
      <div className="mt-6 space-y-4">
        {filteredTasks.length === 0 && taskFilter === 'completed' && <div>No completed tasks yet.</div>}
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-zinc-950 bg-opacity-70 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-semibold">{task.name}</p>
              <p className="text-golden-moon flex">
                <img aria-hidden="true" alt="team-icon" src={logo} className="mr-2" width="25" height="5" />
                {task.reward.toLocaleString()} LAR
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {task.status === 'start' && (
                <button 
                onClick={() => handleStartClick(task.id, task.linkz)} 
                className="bg-golden-moon text-white py-2 px-4 rounded-xl"
                disabled={loadingTask === task.id}
              >
                {loadingTask === task.id ? (
                  <div className="spinner-border spinner-border-sm"></div>
                ) : (
                  'Start'
                )}
              </button>
                
              )}
              {task.status === 'claim' && (
                <button
                  onClick={() => handleClaimClick(task.id, task.reward)}
                  className="bg-golden-moon text-white py-2 px-4 rounded-xl"
                >
                   {loadingTask === task.id ? <div className="spinner-border spinner-border-sm"></div> : 'Claim'}
                </button>
              )}
              {task.status === 'completed' && (
                <button className="bg-golden-moon text-white py-2 px-4 rounded-xl" disabled>
                  Completed
                </button>
              )}
              {showGoButton && task.status === 'completed' && (
                <a href={task.link} target="_blank" rel="noopener noreferrer" className="bg-primary text-primary-foreground py-2 px-4 text-golden-moon rounded-lg">
                  Go
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
      <AnimatePresence>
        {showRCTasks && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            onClick={() => setShowRCTasks(false)}
          >
            <RCTasks onClose={() => setShowRCTasks(false)} task={selectedTask} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-md sticky bottom-0 left-0 flex text-white bg-zinc-900 justify-around py-1">
        <Footer />
      </div>
    </div>
  );
};

export default Tasks;