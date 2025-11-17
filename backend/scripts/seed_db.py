from __future__ import annotations

import argparse
import random
from datetime import datetime, timedelta
from typing import List

from faker import Faker

from app.database import (
    DATETIME_FORMAT,
    calculate_total_inventory,
    create_tables,
    get_connection,
    insert_item,
    insert_movement,
)
from app.schemas import MovementKind

CATEGORIES: List[str] = [
    "Matéria-prima",
    "Componente",
    "Produto acabado",
    "Consumível",
    "Embalagem",
]

BASE_ITEMS = [
    "Parafuso aço",
    "Arruela inox",
    "Chapa aço carbono",
    "Tubo PVC",
    "Fio cobre",
    "Óleo lubrificante",
    "Caixa papelão",
    "Película termoencolhível",
]

UNITS: List[str] = ["un", "kg", "L", "m", "caixa(s)"]


def clear_tables(conn) -> None:
    cursor = conn.cursor()
    cursor.execute("DELETE FROM movements;")
    cursor.execute("DELETE FROM items;")
    conn.commit()


def generate_items(faker: Faker, count: int) -> List[dict[str, float | str]]:
    items: List[dict[str, float | str]] = []
    for _ in range(count):
        # 30% chance de item real de estoque
        if random.random() < 0.3:
            name = faker.random_element(BASE_ITEMS)
        else:
            name = f"{faker.color_name()} {faker.word()}".lower()

        category = faker.random_element(CATEGORIES)
        unit = faker.random_element(UNITS)

        # Regras por unidade
        if unit in ["kg", "L"]:
            quantity = round(random.uniform(1, 120), 2)
        elif unit == "m":
            quantity = round(random.uniform(1, 500), 2)
        elif unit == "caixa(s)":
            quantity = random.randint(1, 40)
        else:  # unidade un
            quantity = random.randint(1, 800)

        # Preço unitário aproximado
        if category == "Matéria-prima":
            unit_price = round(random.uniform(5, 120), 2)
        elif category == "Componente":
            unit_price = round(random.uniform(1, 35), 2)
        elif category == "Embalagem":
            unit_price = round(random.uniform(0.2, 8), 2)
        else:
            unit_price = round(random.uniform(2, 200), 2)

        items.append(
            {
                "name": name,
                "category": category,
                "unit": unit,
                "quantity": quantity,
                "unit_price": unit_price,
            }
        )

    return items


def seed_database(*, force: bool = False, item_count: int = 5, seed: int | None = None) -> None:
    faker = Faker("pt_BR")
    if seed is not None:
        Faker.seed(seed)
        random.seed(seed)

    with get_connection() as conn:
        create_tables(conn)

        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM items;")
        existing = cursor.fetchone()[0]
        if existing and not force:
            print("O banco de dados já contém itens. Use --force para repopular.")
            return

        if force:
            clear_tables(conn)

        seed_items = generate_items(faker, item_count)
        # Base timestamp so data remains reproducible with --seed
        base_time = datetime.utcnow()
        for idx, payload in enumerate(seed_items):
            item_id = insert_item(conn, **payload)
            # Spread timestamps by seconds (can adjust granularity if needed)
            timestamp_dt = base_time + timedelta(seconds=idx)
            timestamp = timestamp_dt.strftime(DATETIME_FORMAT)
            total_after = calculate_total_inventory(conn)
            insert_movement(
                conn,
                item_id=item_id,
                movement_type=MovementKind.INIT.value,
                quantity=payload["quantity"],
                unit_price=payload["unit_price"],
                timestamp=timestamp,
                quantity_after=payload["quantity"],
                total_value_after=total_after,
            )
        conn.commit()
        print(f"Inseridos {len(seed_items)} itens no inventory.db")


def main() -> None:
    parser = argparse.ArgumentParser(description="Inicie o banco de dados de inventário com dados de amostra.")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Limpar dados existentes antes de popular",
    )
    parser.add_argument(
        "--items",
        type=int,
        default=5,
        help="Quantos produtos gerar (padrão: 5)",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help="Semente aleatória opcional para dados reproduzíveis",
    )
    args = parser.parse_args()

    if args.items <= 0:
        raise SystemExit("--items must be greater than zero")

    seed_database(force=args.force, item_count=args.items, seed=args.seed)


if __name__ == "__main__":
    main()
