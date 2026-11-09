CREATE TABLE IF NOT EXISTS questions (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 nickname TEXT NOT NULL,
 question TEXT NOT NULL,
 answer TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
