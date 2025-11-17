from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Generator, Iterable, List, Optional

DB_PATH = Path(__file__).resolve().parent.parent / "inventory.db"
DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"


@contextmanager
def get_connection() -> Generator[sqlite3.Connection, None, None]:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def create_tables(conn: sqlite3.Connection) -> None:
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            unit TEXT NOT NULL,
            quantity REAL NOT NULL DEFAULT 0.0,
            unit_price REAL NOT NULL DEFAULT 0.0
        );
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER NOT NULL,
            movement_type TEXT NOT NULL,
            quantity REAL NOT NULL,
            unit_price REAL NOT NULL,
            timestamp TEXT NOT NULL,
            quantity_after REAL NOT NULL,
            total_value_after REAL NOT NULL,
            FOREIGN KEY (item_id) REFERENCES items(id)
        );
        """
    )
    conn.commit()


def calculate_total_inventory(conn: sqlite3.Connection) -> float:
    cursor = conn.cursor()
    cursor.execute("SELECT quantity, unit_price FROM items;")
    total = 0.0
    for row in cursor.fetchall():
        quantity = row["quantity"] or 0.0
        unit_price = row["unit_price"] or 0.0
        total += quantity * unit_price
    return total


def fetch_item(conn: sqlite3.Connection, item_id: int) -> Optional[sqlite3.Row]:
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, category, unit, quantity, unit_price FROM items WHERE id = ?;",
        (item_id,),
    )
    return cursor.fetchone()


def fetch_all_items(conn: sqlite3.Connection) -> Iterable[sqlite3.Row]:
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, category, unit, quantity, unit_price FROM items ORDER BY id;")
    return cursor.fetchall()


def search_items(conn: sqlite3.Connection, pattern: str) -> Iterable[sqlite3.Row]:
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, name, category, unit, quantity, unit_price
        FROM items
        WHERE name LIKE ? OR category LIKE ?
        ORDER BY name;
        """,
        (pattern, pattern),
    )
    return cursor.fetchall()


def insert_item(
    conn: sqlite3.Connection,
    *,
    name: str,
    category: str,
    unit: str,
    quantity: float,
    unit_price: float,
) -> int:
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO items (name, category, unit, quantity, unit_price)
        VALUES (?, ?, ?, ?, ?);
        """,
        (name, category, unit, quantity, unit_price),
    )
    return cursor.lastrowid


def update_item_record(
    conn: sqlite3.Connection,
    *,
    item_id: int,
    quantity: float,
    unit_price: float,
) -> None:
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE items SET quantity = ?, unit_price = ? WHERE id = ?;",
        (quantity, unit_price, item_id),
    )


def delete_item(conn: sqlite3.Connection, item_id: int) -> None:
    cursor = conn.cursor()
    cursor.execute("DELETE FROM movements WHERE item_id = ?;", (item_id,))
    cursor.execute("DELETE FROM items WHERE id = ?;", (item_id,))


def insert_movement(
    conn: sqlite3.Connection,
    *,
    item_id: int,
    movement_type: str,
    quantity: float,
    unit_price: float,
    timestamp: str,
    quantity_after: float,
    total_value_after: float,
) -> int:
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO movements (
            item_id,
            movement_type,
            quantity,
            unit_price,
            timestamp,
            quantity_after,
            total_value_after
        )
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """,
        (
            item_id,
            movement_type,
            quantity,
            unit_price,
            timestamp,
            quantity_after,
            total_value_after,
        ),
    )
    return cursor.lastrowid


def list_movements_rows(
    conn: sqlite3.Connection,
    *,
    item_id: Optional[int] = None,
    limit: Optional[int] = None,
) -> Iterable[sqlite3.Row]:
    cursor = conn.cursor()
    query = (
        "SELECT id, item_id, movement_type, quantity, unit_price, timestamp, quantity_after, total_value_after "
        "FROM movements"
    )
    params: List[object] = []
    if item_id is not None:
        query += " WHERE item_id = ?"
        params.append(item_id)
    query += " ORDER BY datetime(timestamp) DESC"
    if limit is not None:
        query += " LIMIT ?"
        params.append(limit)
    cursor.execute(query, tuple(params))
    return cursor.fetchall()


def fetch_movement_by_id(conn: sqlite3.Connection, movement_id: int) -> Optional[sqlite3.Row]:
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, item_id, movement_type, quantity, unit_price, timestamp, quantity_after, total_value_after
        FROM movements
        WHERE id = ?;
        """,
        (movement_id,),
    )
    return cursor.fetchone()


def fetch_inventory_series(conn: sqlite3.Connection) -> Iterable[sqlite3.Row]:
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT timestamp, total_value_after
        FROM movements
        ORDER BY datetime(timestamp);
        """
    )
    return cursor.fetchall()


def fetch_item_series(conn: sqlite3.Connection, item_id: int) -> Iterable[sqlite3.Row]:
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT timestamp, quantity_after
        FROM movements
        WHERE item_id = ?
        ORDER BY datetime(timestamp);
        """,
        (item_id,),
    )
    return cursor.fetchall()
