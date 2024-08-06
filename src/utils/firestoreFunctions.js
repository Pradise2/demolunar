// src/firestoreFunctions.js
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; 
import axios from 'axios';
// Home Collection Functions
export const addUserToHome = async (userId, userData) => {
  await setDoc(doc(db, "Home", userId.toString()), userData);
};

export const getUserFromHome = async (userId) => {
  const docRef = doc(db, "Home", userId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

// Tasks Collection Functions
export const addUserTasks = async (userId, tasks) => {
  await setDoc(doc(db, "Tasks", userId.toString()), tasks);
  // await updateUserCount("Tasks");
};

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

export const updateFarmBalance = async (userId, newBalance) => {
  const userRef = doc(db, "Farm", userId.toString());
  await updateDoc(userRef, {
    FarmBalance: newBalance,
  });
};

// Squad Collection Functions
export const addUserToSquad = async (userId, squadData) => {
  await setDoc(doc(db, "Squad", userId.toString()), squadData);
};

export const getUserFromSquad = async (userId) => {
  const docRef = doc(db, "Squad", userId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

// Function to get user count from the UserCount collection
export const getUserCount = async (collectionName) => {
  const countDocRef = doc(db, "UserCount", collectionName);
  const countDocSnap = await getDoc(countDocRef);

  if (countDocSnap.exists()) {
    return countDocSnap.data().userCount;
  } else {
    console.log("No such document!");
    return 0;
  }
};
