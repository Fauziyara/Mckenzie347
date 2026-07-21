import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'arc-indexer.db');

let db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (db) return db;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  initSchema(db);
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      address TEXT PRIMARY KEY,
      symbol TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL DEFAULT '',
      decimals INTEGER NOT NULL DEFAULT 18,
      first_seen_block INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS pairs (
      address TEXT PRIMARY KEY,
      factory TEXT NOT NULL,
      pair_index INTEGER,
      token0 TEXT NOT NULL,
      token1 TEXT NOT NULL,
      reserve0 TEXT NOT NULL DEFAULT '0',
      reserve1 TEXT NOT NULL DEFAULT '0',
      total_swaps INTEGER NOT NULL DEFAULT 0,
      total_volume0 TEXT NOT NULL DEFAULT '0',
      total_volume1 TEXT NOT NULL DEFAULT '0',
      first_seen_block INTEGER,
      updated_at INTEGER,
      FOREIGN KEY (token0) REFERENCES tokens(address),
      FOREIGN KEY (token1) REFERENCES tokens(address)
    );

    CREATE INDEX IF NOT EXISTS idx_pairs_factory ON pairs(factory);
    CREATE INDEX IF NOT EXISTS idx_pairs_token0 ON pairs(token0);
    CREATE INDEX IF NOT EXISTS idx_pairs_token1 ON pairs(token1);

    CREATE TABLE IF NOT EXISTS swaps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pair_address TEXT NOT NULL,
      tx_hash TEXT NOT NULL,
      log_index INTEGER NOT NULL,
      block_number INTEGER NOT NULL,
      timestamp INTEGER NOT NULL,
      sender TEXT,
      recipient TEXT,
      amount0_in TEXT NOT NULL DEFAULT '0',
      amount1_in TEXT NOT NULL DEFAULT '0',
      amount0_out TEXT NOT NULL DEFAULT '0',
      amount1_out TEXT NOT NULL DEFAULT '0',
      FOREIGN KEY (pair_address) REFERENCES pairs(address)
    );

    CREATE INDEX IF NOT EXISTS idx_swaps_pair ON swaps(pair_address);
    CREATE INDEX IF NOT EXISTS idx_swaps_block ON swaps(block_number);
    CREATE INDEX IF NOT EXISTS idx_swaps_tx ON swaps(tx_hash);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_swaps_unique ON swaps(tx_hash, log_index);

    CREATE TABLE IF NOT EXISTS sync_state (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

export function getState(key: string, defaultValue: string = ''): string {
  const db = getDB();
  const row = db.prepare('SELECT value FROM sync_state WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? defaultValue;
}

export function setState(key: string, value: string): void {
  const db = getDB();
  db.prepare('INSERT OR REPLACE INTO sync_state (key, value) VALUES (?, ?)').run(key, value);
}

export function upsertToken(addr: string, symbol: string, name: string, decimals: number, block: number): void {
  const db = getDB();
  db.prepare(`
    INSERT INTO tokens (address, symbol, name, decimals, first_seen_block, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(address) DO UPDATE SET
      symbol = excluded.symbol,
      name = excluded.name,
      decimals = excluded.decimals,
      updated_at = excluded.updated_at
  `).run(addr.toLowerCase(), symbol, name, decimals, block, Date.now());
}

export function upsertPair(
  address: string,
  factory: string,
  pairIndex: number,
  token0: string,
  token1: string,
  block: number
): void {
  const db = getDB();
  db.prepare(`
    INSERT INTO pairs (address, factory, pair_index, token0, token1, first_seen_block, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(address) DO UPDATE SET
      factory = excluded.factory,
      pair_index = excluded.pair_index,
      token0 = excluded.token0,
      token1 = excluded.token1,
      updated_at = excluded.updated_at
  `).run(address.toLowerCase(), factory.toLowerCase(), pairIndex, token0.toLowerCase(), token1.toLowerCase(), block, Date.now());
}

export function updateReserves(address: string, reserve0: string, reserve1: string): void {
  const db = getDB();
  db.prepare(`
    UPDATE pairs SET reserve0 = ?, reserve1 = ?, updated_at = ? WHERE address = ?
  `).run(reserve0, reserve1, Date.now(), address.toLowerCase());
}

export function insertSwap(swap: {
  pair_address: string;
  tx_hash: string;
  log_index: number;
  block_number: number;
  timestamp: number;
  sender: string;
  recipient: string;
  amount0_in: string;
  amount1_in: string;
  amount0_out: string;
  amount1_out: string;
}): void {
  const db = getDB();
  db.prepare(`
    INSERT OR IGNORE INTO swaps
      (pair_address, tx_hash, log_index, block_number, timestamp, sender, recipient, amount0_in, amount1_in, amount0_out, amount1_out)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    swap.pair_address.toLowerCase(),
    swap.tx_hash,
    swap.log_index,
    swap.block_number,
    swap.timestamp,
    swap.sender?.toLowerCase() || '',
    swap.recipient?.toLowerCase() || '',
    swap.amount0_in,
    swap.amount1_in,
    swap.amount0_out,
    swap.amount1_out
  );
}

export function incrementPairSwapCount(address: string, vol0: string, vol1: string): void {
  const db = getDB();
  db.prepare(`
    UPDATE pairs SET
      total_swaps = total_swaps + 1,
      total_volume0 = CAST(CAST(total_volume0 AS INTEGER) + ? AS TEXT),
      total_volume1 = CAST(CAST(total_volume1 AS INTEGER) + ? AS TEXT),
      updated_at = ?
    WHERE address = ?
  `).run(vol0, vol1, Date.now(), address.toLowerCase());
}

export function getDBPath(): string {
  return DB_PATH;
}
