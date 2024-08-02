// src/firestoreFunctions.js
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; 

// Home Collection Functions


// Tasks Collection Functions
export const addUserTasks = async (userId, tasks) => {
  await setDoc(doc(db, "Tasks", userId.toString()),  tasks );
};

export const getUserTasks = async (userId) => {
  const docRef = doc(db, "Tasks", userId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

// Farm Collection Functions
export const addUserToFarm = async (userId, farmData) => {
  await setDoc(doc(db, "Farm", userId.toString()), farmData);
};

export const getUserFromFarm = async (userId) => {
  const docRef = doc(db, "Farm", userId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
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
