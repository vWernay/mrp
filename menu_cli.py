from __future__ import annotations

import sys
from datetime import datetime
from typing import Optional

from app.database import (
    DATETIME_FORMAT,
    calculate_total_inventory,
    create_tables,
    delete_item as db_delete_item,
    fetch_all_items,
    fetch_item,
    get_connection,
    insert_item,
    insert_movement,
)
from app.schemas import MovementKind


LOW_STOCK_THRESHOLD = 5


def input_nonempty(prompt: str) -> str:
    while True:
        value = input(prompt).strip()
        if value:
            return value
        print("Valor inválido. Tente novamente.")


def input_float(prompt: str, *, min_value: Optional[float] = None) -> float:
    while True:
        raw = input(prompt).strip().replace(",", ".")
        try:
            val = float(raw)
        except ValueError:
            print("Informe um número válido.")
            continue
        if min_value is not None and val < min_value:
            print(f"O valor mínimo é {min_value}.")
            continue
        return val


def print_item_row(row) -> None:
    quantity = row["quantity"] or 0.0
    unit_price = row["unit_price"] or 0.0
    total_value = quantity * unit_price
    low_stock = quantity < LOW_STOCK_THRESHOLD
    flag = " (BAIXO ESTOQUE)" if low_stock else ""
    print(
        f"ID: {row['id']} | Nome: {row['name']} | Categoria: {row['category']} | "
        f"Preço: R$ {unit_price:.2f} | Quantidade: {quantity:g} {row['unit']} | Total: R$ {total_value:.2f}{flag}"
    )


def action_listar() -> None:
    with get_connection() as conn:
        rows = fetch_all_items(conn)
        if not rows:
            print("Nenhum produto cadastrado.")
            return
        for row in rows:
            print_item_row(row)


def action_cadastrar() -> None:
    print("\nCadastrar novo produto")
    name = input_nonempty("Nome: ")
    category = input_nonempty("Categoria: ")
    unit = input_nonempty("Unidade (ex.: un, kg, L): ")
    quantity = input_float("Quantidade inicial: ", min_value=0)
    unit_price = input_float("Preço unitário: R$ ", min_value=0)

    with get_connection() as conn:
        create_tables(conn)
        item_id = insert_item(
            conn,
            name=name,
            category=category,
            unit=unit,
            quantity=quantity,
            unit_price=unit_price,
        )
        timestamp = datetime.utcnow().strftime(DATETIME_FORMAT)
        total_after = calculate_total_inventory(conn)
        insert_movement(
            conn,
            item_id=item_id,
            movement_type=MovementKind.INIT.value,
            quantity=quantity,
            unit_price=unit_price,
            timestamp=timestamp,
            quantity_after=quantity,
            total_value_after=total_after,
        )
        conn.commit()
        row = fetch_item(conn, item_id)
        print("\nProduto cadastrado:")
        if row:
            print_item_row(row)


def select_item_by_name(conn, name: str) -> Optional[int]:
    rows = [r for r in fetch_all_items(conn) if r["name"].lower() == name.lower()]
    if not rows:
        return None
    if len(rows) == 1:
        return rows[0]["id"]
    print("\nVários produtos com este nome encontrados:")
    for idx, r in enumerate(rows, start=1):
        print(f"{idx}) ", end="")
        print_item_row(r)
    while True:
        raw = input("Selecione o número para excluir (ou Enter para cancelar): ").strip()
        if raw == "":
            return None
        try:
            i = int(raw)
        except ValueError:
            print("Escolha um número válido.")
            continue
        if 1 <= i <= len(rows):
            return rows[i - 1]["id"]
        print("Opção fora do intervalo.")


def action_excluir() -> None:
    print("\nExcluir produto")
    print("1) Pelo ID")
    print("2) Pelo nome")
    opt = input("Escolha (1/2): ").strip()
    with get_connection() as conn:
        item_id: Optional[int] = None
        if opt == "1":
            raw = input("ID do produto: ").strip()
            try:
                item_id = int(raw)
            except ValueError:
                print("ID inválido.")
                return
            if not fetch_item(conn, item_id):
                print("Produto não encontrado.")
                return
        elif opt == "2":
            name = input_nonempty("Nome do produto: ")
            item_id = select_item_by_name(conn, name)
            if item_id is None:
                print("Nenhum produto selecionado/encontrado.")
                return
        else:
            print("Opção inválida.")
            return

        confirm = input(f"Confirmar exclusão do ID {item_id}? (s/N): ").strip().lower()
        if confirm != "s":
            print("Operação cancelada.")
            return
        db_delete_item(conn, item_id)
        conn.commit()
        print("Produto excluído.")


def main() -> None:
    with get_connection() as conn:
        create_tables(conn)

    while True:
        print("\n=== Menu Estoque (Mini-ERP) ===")
        print("1) Cadastrar produto")
        print("2) Excluir produto (ID ou nome)")
        print("3) Listar produtos")
        print("4) Sair")
        choice = input("Escolha uma opção: ").strip()

        if choice == "1":
            action_cadastrar()
        elif choice == "2":
            action_excluir()
        elif choice == "3":
            action_listar()
        elif choice == "4":
            print("Saindo...")
            break
        else:
            print("Opção inválida, tente novamente.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nEncerrado pelo usuário.")
        sys.exit(0)
