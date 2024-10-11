import { Category, Habit, HabitLog, Journal } from "@/interfaces/Journal";
import { journals } from "./test_data";
import * as SQLite from "expo-sqlite";

const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("journals.db");
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS journals (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, dateCreated TEXT);
    CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, frequency TEXT, icon TEXT, type TEXT, unit TEXT, goal INTEGER, startDate TEXT, color TEXT, categoryId INTEGER);
    CREATE TABLE IF NOT EXISTS habitLogs (id INTEGER PRIMARY KEY AUTOINCREMENT, habitId INTEGER, date TEXT, numericValue INTEGER);
    CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, color TEXT);`
  );

  return db;
};

export const deleteDatabase = async () => {
  const db = await initDatabase();
  await db.closeAsync();
  await SQLite.deleteDatabaseAsync("journals.db");
};

export const getHabits = async () => {
  const db = await initDatabase();
  const allRows = await db.getAllAsync("SELECT * FROM habits");
  console.log(allRows);
  return allRows as Habit[];
};

export const getCategories = async () => {
  const db = await initDatabase();
  const allRows = await db.getAllAsync("SELECT * FROM categories");
  return allRows as Category[];
};

export const getCategoryById = async (id: number) => {
  const db = await initDatabase();
  const category = await db.getFirstAsync(`SELECT * FROM categories WHERE id = ?`, id);
  return category as Category;
};

export const addCategory = async (name: string, color: string) => {
  const db = await initDatabase();
  await db.runAsync("INSERT INTO categories (name, color) VALUES (?, ?)", name, color);
};

export const addHabit = async (habit: Habit) => {
  const db = await initDatabase();
  await db.runAsync(
    "INSERT INTO habits (name, frequency, icon, type, unit, goal, startDate, color, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    habit.name,
    habit.frequency,
    habit.icon,
    habit.type,
    habit.unit || "",
    habit.goal || 0,
    habit.startDate,
    habit.color,
    habit.categoryId || null
  );
};

export const updateHabit = async (habit: Habit, id: number) => {
  const db = await initDatabase();
  await db.runAsync(
    "UPDATE habits SET name = ?, frequency = ?, icon = ?, type = ?, unit = ?, goal = ?, color = ?, categoryId = ? WHERE id = ?",
    habit.name,
    habit.frequency,
    habit.icon,
    habit.type,
    habit.unit || "",
    habit.goal || 0,
    habit.color,
    habit.categoryId || null,
    id
  );
};

export const deleteHabit = async (id: number) => {
  const db = await initDatabase();
  await db.runAsync("DELETE FROM habits WHERE id = ?", id);
};

export const getHabitById = async (id: number) => {
  const db = await initDatabase();
  const habit = await db.getFirstAsync(`SELECT * FROM habits WHERE id = ?`, id);
  return habit as Habit;
};

export const addHabitLog = async (habitId: number, date: string, numericValue: number) => {
  const db = await initDatabase();
  await db.runAsync(
    "INSERT INTO habitLogs (habitId, date, numericValue) VALUES (?, ?, ?)",
    habitId,
    date,
    numericValue
  );
};

export const deleteHabitLog = async (id: number) => {
  const db = await initDatabase();
  await db.runAsync("DELETE FROM habitLogs WHERE id = ?", id);
};

export const getHabitLogsByHabitId = async (habitId: number) => {
  const db = await initDatabase();
  const habitLogs = await db.getAllAsync(`SELECT * FROM habitLogs WHERE habitId = ?`, habitId);
  return habitLogs as HabitLog[];
};

export const getJournals = async () => {
  const db = await initDatabase();
  const allRows = await db.getAllAsync("SELECT * FROM journals");
  console.log(allRows);
  return allRows as Journal[];
};

export const getJournalById = async (id: number) => {
  const db = await initDatabase();
  const journal = await db.getFirstAsync(
    `SELECT * FROM journals WHERE id = ?`,
    id
  );
  return journal as Journal;
};

export const addJournal = async (journal: Journal) => {
  try {
    const db = await initDatabase();
    console.log(journal);
    await db.runAsync(
      `INSERT INTO journals (title, content, dateCreated) VALUES (?, ?, ?)`,
      journal.title,
      journal.content,
      journal.dateCreated
    );
    console.log("Journal added", await getJournals());
  } catch (error) {
    console.error("Error adding journal:", error);
  }
};
