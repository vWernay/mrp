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
