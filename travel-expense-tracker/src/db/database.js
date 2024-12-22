import { openDB } from 'idb';

const DB_NAME = 'TravelExpenseTrackerDB';
const DB_VERSION = 1;

async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create trips store
      if (!db.objectStoreNames.contains('trips')) {
        const tripStore = db.createObjectStore('trips', { keyPath: 'id', autoIncrement: true });
        tripStore.createIndex('name', 'name');
        tripStore.createIndex('startDate', 'startDate');
        tripStore.createIndex('endDate', 'endDate');
      }

      // Create participants store
      if (!db.objectStoreNames.contains('participants')) {
        const participantStore = db.createObjectStore('participants', { keyPath: 'id', autoIncrement: true });
        participantStore.createIndex('tripId', 'tripId');
        participantStore.createIndex('name', 'name');
      }

      // Create expenses store
      if (!db.objectStoreNames.contains('expenses')) {
        const expenseStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
        expenseStore.createIndex('tripId', 'tripId');
        expenseStore.createIndex('paidBy', 'paidBy');
        expenseStore.createIndex('date', 'date');
        expenseStore.createIndex('category', 'category');
      }
    },
  });
  return db;
}

// Trip functions
export async function addTrip(trip) {
  const db = await initDB();
  return await db.add('trips', trip);
}

export async function updateTrip(trip) {
  const db = await initDB();
  return await db.put('trips', trip);
}

export async function deleteTrip(tripId) {
  const db = await initDB();
  await db.delete('expenses', tripId);
  await db.delete('participants', tripId);
  await db.delete('trips', tripId);
}

export async function getTrip(tripId) {
  const db = await initDB();
  return await db.get('trips', tripId);
}

export async function getAllTrips() {
  const db = await initDB();
  return await db.getAll('trips');
}

// Participant functions
export async function addParticipant(participant) {
  const db = await initDB();
  return await db.add('participants', participant);
}

export async function updateParticipant(participant) {
  const db = await initDB();
  return await db.put('participants', participant);
}

export async function deleteParticipant(participantId) {
  const db = await initDB();
  await db.delete('participants', participantId);
}

export async function getTripParticipants(tripId) {
  console.log('getTripParticipants called with tripId:', tripId);
  const db = await initDB();
  const tx = db.transaction('participants', 'readonly');
  const index = tx.store.index('tripId');
  const participants = await index.getAll(tripId);
  console.log('Retrieved participants:', participants);
  return participants;
}

// Expense functions
export async function addExpense(expense) {
  const db = await initDB();
  return await db.add('expenses', expense);
}

export async function updateExpense(expense) {
  const db = await initDB();
  return await db.put('expenses', expense);
}

export async function deleteExpense(expenseId) {
  const db = await initDB();
  await db.delete('expenses', expenseId);
}

export async function getTripExpenses(tripId) {
  const db = await initDB();
  const tx = db.transaction('expenses', 'readonly');
  const index = tx.store.index('tripId');
  return await index.getAll(tripId);
}

export async function getParticipantExpenses(participantId) {
  const db = await initDB();
  const tx = db.transaction('expenses', 'readonly');
  const index = tx.store.index('paidBy');
  return await index.getAll(participantId);
}
