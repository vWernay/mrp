from __future__ import annotations

import sqlite3
from datetime import datetime
from typing import Generator, List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware

from .database import (
    DATETIME_FORMAT,
    calculate_total_inventory,
    create_tables,
    delete_item,
    fetch_all_items,
    fetch_item,
    fetch_item_series,
    fetch_inventory_series,
    fetch_movement_by_id,
    get_connection,
    insert_item,
    insert_movement,
    list_movements_rows,
    search_items as search_items_db,
    update_item_record,
)
from .schemas import (
    InventoryPoint,
    ItemCreate,
    ItemQuantityPoint,
    ItemRead,
    MovementCreate,
    MovementKind,
    MovementRead,
)
from .services import (
    build_item_output,
    build_inventory_points,
    build_item_quantity_points,
    build_movement_output,
)

app = FastAPI(title="Inventory MRP API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    with get_connection() as conn:
        create_tables(conn)


def connection_dependency() -> Generator[sqlite3.Connection, None, None]:
    with get_connection() as conn:
        yield conn


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/items", response_model=ItemRead, status_code=201)
def create_item_endpoint(
    item: ItemCreate,
    conn: sqlite3.Connection = Depends(connection_dependency),
) -> ItemRead:
    item_id = insert_item(
        conn,
        name=item.name,
        category=item.category,
        unit=item.unit,
        quantity=item.quantity,
        unit_price=item.unit_price,
    )
    timestamp = datetime.utcnow().strftime(DATETIME_FORMAT)
    total_after = calculate_total_inventory(conn)
    insert_movement(
        conn,
        item_id=item_id,
        movement_type=MovementKind.INIT.value,
        quantity=item.quantity,
        unit_price=item.unit_price,
        timestamp=timestamp,
        quantity_after=item.quantity,
        total_value_after=total_after,
    )
    conn.commit()
    row = fetch_item(conn, item_id)
    if row is None:
        raise HTTPException(status_code=500, detail="Failed to load saved item")
    return build_item_output(row)


@app.get("/items", response_model=List[ItemRead])
def list_items_endpoint(conn: sqlite3.Connection = Depends(connection_dependency)) -> List[ItemRead]:
    rows = fetch_all_items(conn)
    return [build_item_output(row) for row in rows]


@app.get("/items/{item_id}", response_model=ItemRead)
def get_item_endpoint(
    item_id: int,
    conn: sqlite3.Connection = Depends(connection_dependency),
) -> ItemRead:
    row = fetch_item(conn, item_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return build_item_output(row)


@app.delete("/items/{item_id}", status_code=204)
def delete_item_endpoint(
    item_id: int,
    conn: sqlite3.Connection = Depends(connection_dependency),
) -> Response:
    if fetch_item(conn, item_id) is None:
        raise HTTPException(status_code=404, detail="Item not found")
    delete_item(conn, item_id)
    conn.commit()
    return Response(status_code=204)


@app.get("/items/search", response_model=List[ItemRead])
def search_items_endpoint(
    term: str = Query(..., min_length=1),
    conn: sqlite3.Connection = Depends(connection_dependency),
) -> List[ItemRead]:
    pattern = f"%{term}%"
    rows = search_items_db(conn, pattern)
    return [build_item_output(row) for row in rows]


@app.post("/movements", response_model=MovementRead, status_code=201)
def register_movement_endpoint(
    payload: MovementCreate,
    conn: sqlite3.Connection = Depends(connection_dependency),
) -> MovementRead:
    if payload.movement_type is MovementKind.INIT:
        raise HTTPException(status_code=400, detail="movement_type must be entry or exit")

    item = fetch_item(conn, payload.item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    current_quantity = item["quantity"] or 0.0
    current_price = item["unit_price"] or 0.0

    if payload.movement_type is MovementKind.EXIT and payload.quantity > current_quantity:
        raise HTTPException(status_code=400, detail="Quantity exceeds current stock")

    updated_price = payload.unit_price if payload.unit_price is not None else current_price
    if payload.movement_type is MovementKind.ENTRY:
        new_quantity = current_quantity + payload.quantity
    else:
        new_quantity = current_quantity - payload.quantity

    update_item_record(
        conn,
        item_id=payload.item_id,
        quantity=new_quantity,
        unit_price=updated_price,
    )

    timestamp = datetime.utcnow().strftime(DATETIME_FORMAT)
    total_after = calculate_total_inventory(conn)
    movement_id = insert_movement(
        conn,
        item_id=payload.item_id,
        movement_type=payload.movement_type.value,
        quantity=payload.quantity,
        unit_price=updated_price,
        timestamp=timestamp,
        quantity_after=new_quantity,
        total_value_after=total_after,
    )
    conn.commit()

    row = fetch_movement_by_id(conn, movement_id)
    if row is None:
        raise HTTPException(status_code=500, detail="Failed to load movement")
    return build_movement_output(row)


@app.get("/movements", response_model=List[MovementRead])
def list_movements_endpoint(
    item_id: Optional[int] = Query(None),
    limit: Optional[int] = Query(None, ge=1),
    conn: sqlite3.Connection = Depends(connection_dependency),
) -> List[MovementRead]:
    rows = list_movements_rows(conn, item_id=item_id, limit=limit)
    return [build_movement_output(row) for row in rows]


@app.get("/dashboard/total", response_model=List[InventoryPoint])
def dashboard_total_endpoint(
    conn: sqlite3.Connection = Depends(connection_dependency),
) -> List[InventoryPoint]:
    rows = fetch_inventory_series(conn)
    return build_inventory_points(rows)


@app.get("/dashboard/items/{item_id}", response_model=List[ItemQuantityPoint])
def dashboard_item_quantity_endpoint(
    item_id: int,
    conn: sqlite3.Connection = Depends(connection_dependency),
) -> List[ItemQuantityPoint]:
    if fetch_item(conn, item_id) is None:
        raise HTTPException(status_code=404, detail="Item not found")
    rows = fetch_item_series(conn, item_id)
    return build_item_quantity_points(rows)


__all__ = ["app"]
