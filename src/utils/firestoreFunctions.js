// src/firestoreFunctions.js
import axios from 'axios';
// Home Collection Functions


export const updateUserTasks = async (userId, tasks) => {
  try {
    const response = await axios.post(`https://lunarapp.thelunarcoin.com/testbackend/api/task/updatetask`, { userId, tasks });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding  user farm:", error);
    return null;
  }
};

export const getUserTasks = async (userId) => {
  try {
    const response = await axios.get(`https://lunarapp.thelunarcoin.com/testbackend/api/task/${userId}`);
      console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting  user farm:", error);
    return null;
  }
};

export const getTasks = async () => {
  try {
    const response = await axios.get(`https://lunarapp.thelunarcoin.com/testbackend/api/task/tasks`);
      console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting  user farm:", error);
    return null;
  }
};

// Farm Collection Functions
export const addUserToFarm = async (userId, farmData) => {
  try {
    const response = await axios.post(`https://lunarapp.thelunarcoin.com/testbackend/api/farm/add`, { userId, farmData });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding  user farm:", error);
    return null;
  }
};

export const getUserFromFarm = async (userId) => {
  try {
    const response = await axios.get(`https://lunarapp.thelunarcoin.com/testbackend/api/farm/${userId}`);
      console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting  user farm:", error);
    return null;
  }
};



