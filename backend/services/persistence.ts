import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };
import { v4 as uuidv4 } from 'uuid';

if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = getFirestore(firebaseConfig.firestoreDatabaseId);

/**
 * Cases Collection Operations
 */
export async function saveCase(caseData: any) {
  try {
    const id = caseData.case_id || uuidv4();
    const docRef = db.collection('cases').doc(id);
    const data = { 
      ...caseData, 
      id,
      case_id: id,
      createdAt: Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now().toDate().toISOString(),
      status: caseData.status || 'active'
    };
    await docRef.set(data);
    console.log(`Case ${id} saved to Firestore`);
    return data;
  } catch (error) {
    console.error('Error saving case to Firestore:', error);
    throw error;
  }
}

export async function getCases() {
  try {
    const snapshot = await db.collection('cases').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching cases from Firestore:', error);
    return [];
  }
}

/**
 * Reminders Collection Operations
 */
export async function saveReminder(reminderData: any) {
  try {
    const id = uuidv4();
    const docRef = db.collection('reminders').doc(id);
    const data = { 
      ...reminderData, 
      id, 
      createdAt: Timestamp.now().toDate().toISOString(),
      type: reminderData.type || 'standard'
    };
    await docRef.set(data);
    console.log(`Reminder ${id} saved to Firestore`);
    return data;
  } catch (error) {
    console.error('Error saving reminder to Firestore:', error);
    throw error;
  }
}

export async function getReminders() {
  try {
    const snapshot = await db.collection('reminders').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching reminders from Firestore:', error);
    return [];
  }
}
