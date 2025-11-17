const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

export type ItemDTO = {
  id: number
  name: string
  category: string
  unit: string
  quantity: number
  unit_price: number
  total_value: number
  low_stock: boolean
}

export type Item = {
  id: number
  name: string
  category: string
  unit: string
  quantity: number
  unitPrice: number
  totalValue: number
  lowStock: boolean
}

function mapItem(dto: ItemDTO): Item {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category,
    unit: dto.unit,
    quantity: dto.quantity,
    unitPrice: dto.unit_price,
    totalValue: dto.total_value,
    lowStock: dto.low_stock,
  }
}

export type MovementDTO = {
  id: number
  item_id: number
  movement_type: "entry" | "exit" | "init"
  quantity: number
  unit_price: number
  timestamp: string
  quantity_after: number
  total_value_after: number
}

export type Movement = {
  id: number
  itemId: number
  movementType: "entry" | "exit" | "init"
  quantity: number
  unitPrice: number
  timestamp: string
  quantityAfter: number
  totalValueAfter: number
}

function mapMovement(dto: MovementDTO): Movement {
  return {
    id: dto.id,
    itemId: dto.item_id,
    movementType: dto.movement_type,
    quantity: dto.quantity,
    unitPrice: dto.unit_price,
    timestamp: dto.timestamp,
    quantityAfter: dto.quantity_after,
    totalValueAfter: dto.total_value_after,
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  let data: unknown = null
  if (response.status !== 204) {
    try {
      data = await response.json()
    } catch (error) {
      data = null
    }
  }

  if (!response.ok) {
    if (typeof data === "object" && data !== null && "detail" in data) {
      const detail = (data as { detail?: unknown }).detail
      if (typeof detail === "string") {
        throw new Error(detail)
      }
      if (Array.isArray(detail)) {
        throw new Error(
          detail.filter((item) => typeof item === "string").join(", ")
        )
      }
    }
    throw new Error(response.statusText || "Erro ao comunicar com o servidor")
  }

  if (response.status === 204) {
    return undefined as unknown as T
  }

  return data as T
}

export async function getItems(): Promise<Item[]> {
  const data = await request<ItemDTO[]>("/items")
  return data.map(mapItem)
}

export async function getItem(id: number): Promise<Item> {
  const data = await request<ItemDTO>(`/items/${id}`)
  return mapItem(data)
}

export type CreateItemInput = {
  name: string
  category: string
  unit: string
  quantity: number
  unitPrice: number
}

export async function createItem(payload: CreateItemInput): Promise<Item> {
  const data = await request<ItemDTO>("/items", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      category: payload.category,
      unit: payload.unit,
      quantity: payload.quantity,
      unit_price: payload.unitPrice,
    }),
  })
  return mapItem(data)
}

export async function deleteItem(id: number): Promise<void> {
  await request(`/items/${id}`, {
    method: "DELETE",
  })
}

export type CreateMovementInput = {
  itemId: number
  movementType: "entry" | "exit"
  quantity: number
  unitPrice?: number
}

export async function createMovement(
  payload: CreateMovementInput
): Promise<Movement> {
  const data = await request<MovementDTO>(`/movements`, {
    method: "POST",
    body: JSON.stringify({
      item_id: payload.itemId,
      movement_type: payload.movementType,
      quantity: payload.quantity,
      unit_price: payload.unitPrice,
    }),
  })
  return mapMovement(data)
}

export async function getMovements(
  itemId: number,
  limit = 20
): Promise<Movement[]> {
  const params = new URLSearchParams()
  params.set("item_id", String(itemId))
  if (limit) params.set("limit", String(limit))
  const data = await request<MovementDTO[]>(`/movements?${params.toString()}`)
  return data.map(mapMovement)
}
