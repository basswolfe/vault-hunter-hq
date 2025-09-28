'use server';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Build, PublicUser } from './types';

// Create a new build
export async function createBuild(
  userId: string,
  buildData: Omit<Build, 'id' | 'userId'>
): Promise<Build> {
  const docRef = await addDoc(collection(db, 'builds'), {
    ...buildData,
    userId,
  });
  return { id: docRef.id, ...buildData, userId };
}

// Get all builds for a user
export async function getBuilds(userId: string): Promise<Build[]> {
  const q = query(collection(db, 'builds'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Build)
  );
}

// Get a single build by ID
export async function getBuild(buildId: string): Promise<Build | null> {
  const docRef = doc(db, 'builds', buildId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Build;
  }
  return null;
}

// Update a build
export async function updateBuild(
  buildId: string,
  buildData: Partial<Build>
): Promise<void> {
  const buildRef = doc(db, 'builds', buildId);
  await updateDoc(buildRef, buildData);
}

// Delete a build
export async function deleteBuild(buildId: string): Promise<void> {
  await deleteDoc(doc(db, 'builds', buildId));
}

// Add or update a user in the 'users' collection
export async function upsertUser(userData: PublicUser): Promise<void> {
    const userRef = doc(db, 'users', userData.uid);
    await setDoc(userRef, userData, { merge: true });
}

// Get all users from the 'users' collection
export async function getAllUsers(): Promise<PublicUser[]> {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => doc.data() as PublicUser);
}
