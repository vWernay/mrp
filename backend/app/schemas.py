from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class MovementKind(str, Enum):
    INIT = "init"
    ENTRY = "entry"
    EXIT = "exit"


class ItemBase(BaseModel):
    name: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    unit: str = Field(..., min_length=1)
    quantity: float = Field(..., ge=0)
    unit_price: float = Field(..., ge=0)


class ItemCreate(ItemBase):
    pass


class ItemRead(ItemBase):
    id: int
    total_value: float
    low_stock: bool


class MovementCreate(BaseModel):
    item_id: int
    movement_type: MovementKind
    quantity: float = Field(..., gt=0)
    unit_price: Optional[float] = Field(None, ge=0)


class MovementRead(BaseModel):
    id: int
    item_id: int
    movement_type: MovementKind
    quantity: float
    unit_price: float
    timestamp: datetime
    quantity_after: float
    total_value_after: float


class InventoryPoint(BaseModel):
    timestamp: datetime
    total_value: float


class ItemQuantityPoint(BaseModel):
    timestamp: datetime
    quantity: float
