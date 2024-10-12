import {
  Category,
  FlowStep,
  Habit,
  HabitLog,
  Journal,
  JournalFlow,
} from "@/interfaces/Journal";
import { journals } from "./test_data";
import * as SQLite from "expo-sqlite";
import { Quote, QuotePack } from "@/interfaces/Quotes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("journals.db");
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS journals (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, dateCreated TEXT);
    CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, frequency TEXT, icon TEXT, type TEXT, unit TEXT, goal INTEGER, startDate TEXT, color TEXT, categoryId INTEGER);
    CREATE TABLE IF NOT EXISTS habitLogs (id INTEGER PRIMARY KEY AUTOINCREMENT, habitId INTEGER, date TEXT, numericValue INTEGER);
    CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, color TEXT);
    CREATE TABLE IF NOT EXISTS journal_flows (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT);
    CREATE TABLE IF NOT EXISTS flow_steps (id INTEGER PRIMARY KEY AUTOINCREMENT, flowId INTEGER, stepType TEXT, content TEXT);
    CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, quoteText TEXT, explanation TEXT, author TEXT, packId INTEGER);
    CREATE TABLE IF NOT EXISTS quote_packs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, isPredefined INTEGER);
    `
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
  const category = await db.getFirstAsync(
    `SELECT * FROM categories WHERE id = ?`,
    id
  );
  return category as Category;
};

export const addCategory = async (name: string, color: string) => {
  const db = await initDatabase();
  await db.runAsync(
    "INSERT INTO categories (name, color) VALUES (?, ?)",
    name,
    color
  );
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

export const addHabitLog = async (
  habitId: number,
  date: string,
  numericValue: number
) => {
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
  const habitLogs = await db.getAllAsync(
    `SELECT * FROM habitLogs WHERE habitId = ?`,
    habitId
  );
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

export const deleteJournal = async (id: number) => {
  const db = await initDatabase();
  await db.runAsync("DELETE FROM journals WHERE id = ?", id);
};

// Journal Flows

export const getJournalFlows = async (): Promise<JournalFlow[]> => {
  const db = await initDatabase();
  const allRows = await db.getAllAsync("SELECT * FROM journal_flows");
  return allRows as JournalFlow[];
};

export const getJournalFlowById = async (id: number): Promise<JournalFlow> => {
  const db = await initDatabase();
  const flow = await db.getFirstAsync(
    `SELECT * FROM journal_flows WHERE id = ?`,
    id
  );
  return flow as JournalFlow;
};

export const addJournalFlow = async (flow: JournalFlow): Promise<number> => {
  const db = await initDatabase();
  const journalFlowId: SQLite.SQLiteRunResult = await db.runAsync(
    "INSERT INTO journal_flows (name, description) VALUES (?, ?)",
    flow.name,
    flow.description
  );
  return journalFlowId.lastInsertRowId;
};

export const updateJournalFlow = async (flow: JournalFlow): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync(
    "UPDATE journal_flows SET name = ?, description = ? WHERE id = ?",
    flow.name,
    flow.description,
    flow.id ?? 0
  );
};

export const deleteJournalFlow = async (id: number): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync("DELETE FROM journal_flows WHERE id = ?", id);
  await db.runAsync("DELETE FROM flow_steps WHERE flowId = ?", id); // Delete associated steps
};

// Flow Steps

export const getFlowStepsByFlowId = async (
  flowId: number
): Promise<FlowStep[]> => {
  const db = await initDatabase();
  const steps = await db.getAllAsync(
    `SELECT * FROM flow_steps WHERE flowId = ? ORDER BY id ASC`,
    flowId
  );
  return steps as FlowStep[];
};

export const addFlowStep = async (step: FlowStep): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync(
    "INSERT INTO flow_steps (flowId, stepType, content) VALUES (?, ?, ?)",
    step.flowId,
    step.stepType,
    step.content
  );
};

export const updateFlowStep = async (step: FlowStep): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync(
    "UPDATE flow_steps SET stepType = ?, content = ? WHERE id = ?",
    step.stepType,
    step.content,
    step.id ?? 0
  );
};

export const deleteFlowStep = async (id: number): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync("DELETE FROM flow_steps WHERE id = ?", id);
};

// Quotes

export const getQuotes = async (): Promise<Quote[]> => {
  const db = await initDatabase();
  const quotes = await db.getAllAsync("SELECT * FROM quotes");
  return quotes as Quote[];
};

export const getQuoteById = async (id: number): Promise<Quote> => {
  const db = await initDatabase();
  const quote = await db.getFirstAsync(`SELECT * FROM quotes WHERE id = ?`, id);
  return quote as Quote;
};

export const getQuotesByPackId = async (packId: number): Promise<Quote[]> => {
  const db = await initDatabase();
  const quotes = await db.getAllAsync(
    `SELECT * FROM quotes WHERE packId = ?`,
    packId
  );
  return quotes as Quote[];
};

export const addQuote = async (quote: Quote): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync(
    "INSERT INTO quotes (quoteText, explanation, author, packId) VALUES (?, ?, ?, ?)",
    quote.quoteText,
    quote.explanation,
    quote.author,
    quote.packId
  );
};

export const updateQuote = async (quote: Quote): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync(
    "UPDATE quotes SET quoteText = ?, explanation = ?, author = ?, packId = ? WHERE id = ?",
    quote.quoteText,
    quote.explanation,
    quote.author,
    quote.packId,
    quote.id ?? 0
  );
};

export const getSelectedQuotes = async () => {
  const selectedPackIdsString = await AsyncStorage.getItem(
    "selectedQuotePackIds"
  );
  const selectedPackIds = selectedPackIdsString
    ? JSON.parse(selectedPackIdsString)
    : [];
  if (selectedPackIds.length === 0) return [];
  const placeholders = selectedPackIds.map(() => "?").join(",");
  const db = await initDatabase();
  const quotes = await db.getAllAsync(
    `SELECT * FROM quotes WHERE packId IN (${placeholders})`,
    selectedPackIds
  );
  return quotes as Quote[];
};

export const deleteQuote = async (id: number): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync("DELETE FROM quotes WHERE id = ?", id);
};

// Quote Packs

export const getQuotePackById = async (id: number): Promise<QuotePack> => {
  const db = await initDatabase();
  const pack = await db.getFirstAsync(`SELECT * FROM quote_packs WHERE id = ?`, id);
  return pack as QuotePack;
};

export const getAllQuotePacks = async (): Promise<QuotePack[]> => {
  const db = await initDatabase();
  const packs = await db.getAllAsync("SELECT * FROM quote_packs");
  return packs as QuotePack[];
};

export const addQuotePack = async (pack: QuotePack): Promise<number> => {
  const db = await initDatabase();
  const result = await db.runAsync(
    "INSERT INTO quote_packs (name, description, isPredefined) VALUES (?, ?, ?)",
    pack.name,
    pack.description,
    pack.isPredefined
  );
  return result.lastInsertRowId;
};

export const updateQuotePack = async (pack: QuotePack): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync(
    "UPDATE quote_packs SET name = ?, description = ?, isPredefined = ? WHERE id = ?",
    pack.name,
    pack.description,
    pack.isPredefined,
    pack.id ?? 0
  );
};

export const deleteQuotePack = async (id: number): Promise<void> => {
  const db = await initDatabase();
  await db.runAsync("DELETE FROM quote_packs WHERE id = ?", id);
  await db.runAsync("DELETE FROM quotes WHERE packId = ?", id);
};
