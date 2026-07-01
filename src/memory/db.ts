import { Database } from "bun:sqlite";
import type { Message } from "../providers/types";
import { mkdirSync } from "fs";

mkdirSync("data", { recursive: true }); // create data folder if it doesn't exist

export function connectDB() {
    const db = new Database("data/orbit.db");
    db.run("PRAGMA journal_mode=WAL");
    return db;
}

export function initSchema(db: Database) {
    // Create Table
    db.run(`
    CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch())
    )
`);
}

export function loadHistory(db: Database): Message[] {
    const query = db.query<Message, []>(`SELECT role, content FROM memories`);
    const history = query.all();
    return history;
}

export function saveMessage(db: Database, message: Message) {
    const insert = db.query(`INSERT INTO memories (role, content) VALUES ($role, $content)`);
    insert.run({ $role: message.role, $content: message.content })
}
