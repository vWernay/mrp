from __future__ import annotations

from datetime import datetime
from typing import Iterable, List

from .database import DATETIME_FORMAT
from .schemas import (
    InventoryPoint,
    ItemQuantityPoint,
    ItemRead,
    MovementKind,
    MovementRead,
)

LOW_STOCK_THRESHOLD = 5


def build_item_output(row) -> ItemRead:
    quantity = row["quantity"] or 0.0
    unit_price = row["unit_price"] or 0.0
    return ItemRead(
        id=row["id"],
        name=row["name"],
        category=row["category"],
        unit=row["unit"],
        quantity=quantity,
        unit_price=unit_price,
        total_value=quantity * unit_price,
        low_stock=quantity < LOW_STOCK_THRESHOLD,
    )


def build_movement_output(row) -> MovementRead:
    timestamp = datetime.strptime(row["timestamp"], DATETIME_FORMAT)
    return MovementRead(
        id=row["id"],
        item_id=row["item_id"],
        movement_type=MovementKind(row["movement_type"]),
        quantity=row["quantity"],
        unit_price=row["unit_price"],
        timestamp=timestamp,
        quantity_after=row["quantity_after"],
        total_value_after=row["total_value_after"],
    )


def build_inventory_points(rows: Iterable) -> List[InventoryPoint]:
    points: List[InventoryPoint] = []
    for row in rows:
        timestamp = datetime.strptime(row["timestamp"], DATETIME_FORMAT)
        points.append(
            InventoryPoint(
                timestamp=timestamp,
                total_value=row["total_value_after"],
            )
        )
    return points


def build_item_quantity_points(rows: Iterable) -> List[ItemQuantityPoint]:
    series: List[ItemQuantityPoint] = []
    for row in rows:
        timestamp = datetime.strptime(row["timestamp"], DATETIME_FORMAT)
        series.append(
            ItemQuantityPoint(
                timestamp=timestamp,
                quantity=row["quantity_after"],
            )
        )
    return series
