"use server"

import { revalidatePath } from "next/cache"
import { ZodError } from "zod"
import { createClient } from "@/lib/supabase-server"
import { getMutationClient } from "@/lib/supabase-admin"
import {
  accountMovementPayloadSchema,
  accountMonthConfigPayloadSchema,
} from "@/lib/schemas/account-movement"

export interface AccountMovement {
  id: string
  customer_id: string | null
  party_name: string | null
  concept: string
  type: "ingreso" | "egreso"
  issue_date: string
  paid_date: string
  amount: number
  invoice_number: string | null
  balance: number
  ledger: string
  created_at: string
  customers: { name: string; ruc: string | null } | null
}

const LEDGER_PATHS: Record<string, string> = {
  general: "/admin/cuenta-corriente",
  yape: "/admin/cuenta-yape",
  leonel: "/admin/cuenta-leonel",
  wuardadito_mercaderia: "/admin/wuardadito-mercaderia",
  wuardadito_empresa: "/admin/wuardadito-empresa",
}

function getLedgerPath(ledger: string = "general") {
  return LEDGER_PATHS[ledger] || LEDGER_PATHS.general
}

function revalidate(ledger: string = "general") {
  revalidatePath(getLedgerPath(ledger))
}

function monthRedirect(paidDate: string, ledger: string = "general") {
  const [y, m] = paidDate.split("-")
  if (!y || !m) return getLedgerPath(ledger)
  return `${getLedgerPath(ledger)}?year=${y}&month=${Number(m)}`
}

export async function getMonthInitial(year: number, month: number, ledger: string = "general") {
  const supabase = await createClient()
  const { data } = await supabase
    .from("account_month_config")
    .select("initial_balance")
    .eq("year", year)
    .eq("month", month)
    .eq("ledger", ledger)
    .maybeSingle()

  return Number(data?.initial_balance ?? 0)
}

export async function getAccountMovements(
  filters?: {
    q?: string
    type?: string
    customerId?: string
    from?: string
    to?: string
    ledger?: string
  }
) {
  const supabase = await createClient()
  const ledger = filters?.ledger ?? "general"
  let query = supabase
    .from("account_movements")
    .select("*, customers(name, ruc)")
    .eq("ledger", ledger)
    .order("paid_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (filters?.from) query = query.gte("paid_date", filters.from)
  if (filters?.to) query = query.lte("paid_date", filters.to)
  if (filters?.q && filters.q.trim()) {
    query = query.ilike("concept", `%${filters.q.trim()}%`)
  }
  if (filters?.type === "ingreso" || filters?.type === "egreso") {
    query = query.eq("type", filters.type)
  }
  if (filters?.customerId) {
    query = query.eq("customer_id", filters.customerId)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return (data ?? []) as AccountMovement[]
}

export async function getAccountMovement(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("account_movements")
    .select("*, customers(name, ruc)")
    .eq("id", id)
    .single()

  if (error) throw new Error(error.message)
  return data as AccountMovement
}

export async function getMonthBalance(
  year: number,
  month: number,
  from: string,
  to: string,
  ledger: string = "general"
) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("account_movements")
    .select("type, amount")
    .eq("ledger", ledger)
    .gte("paid_date", from)
    .lte("paid_date", to)

  let net = 0
  for (const movement of data ?? []) {
    net += movement.type === "ingreso" ? Number(movement.amount) : -Number(movement.amount)
  }

  const opening = await getMonthInitial(year, month, ledger)
  return { opening, closing: opening + net }
}

async function recomputeAllBalances() {
  const supabase = await getMutationClient()

  const { data: configs } = await supabase
    .from("account_month_config")
    .select("ledger, year, month, initial_balance")

  const initialByKey = new Map<string, number>()
  for (const config of configs ?? []) {
    initialByKey.set(
      `${config.ledger}-${config.year}-${config.month}`,
      Number(config.initial_balance)
    )
  }

  const { data: movements, error } = await supabase
    .from("account_movements")
    .select("id, type, amount, paid_date, ledger")
    .order("paid_date", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) throw new Error(error.message)

  let running = 0
  let currentKey = ""

  for (const movement of movements ?? []) {
    const [y, m] = String(movement.paid_date).split("-")
    const ledger = movement.ledger || "general"
    const monthKey = `${ledger}-${y}-${Number(m)}`

    if (monthKey !== currentKey) {
      running = initialByKey.get(monthKey) ?? 0
      currentKey = monthKey
    }

    const amount = Number(movement.amount)
    running += movement.type === "ingreso" ? amount : -amount
    await supabase
      .from("account_movements")
      .update({ balance: running })
      .eq("id", movement.id)
  }
}

function parsePayload(formData: FormData) {
  return {
    ledger: (formData.get("ledger") as string) || "general",
    customer_id: (formData.get("customer_id") as string) || "",
    party_name: (formData.get("party_name") as string) || "",
    concept: (formData.get("concept") as string)?.trim() || "",
    type: formData.get("type") as string,
    issue_date: (formData.get("issue_date") as string) || "",
    paid_date: (formData.get("paid_date") as string) || "",
    amount: formData.get("amount") as string,
    invoice_number: (formData.get("invoice_number") as string)?.trim() || null,
  }
}

export async function createMovement(formData: FormData) {
  const supabase = await getMutationClient()
  const payload = parsePayload(formData)

  try {
    accountMovementPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      return { error: e.issues[0]?.message || "Datos inválidos" }
    }
    return { error: "Datos inválidos" }
  }

  const ledger = payload.ledger || "general"
  const isGeneral = ledger === "general"

  const insertData: any = {
    ledger,
    concept: payload.concept,
    type: payload.type,
    issue_date: payload.issue_date,
    paid_date: payload.paid_date,
    amount: payload.amount,
    invoice_number: payload.invoice_number,
  }

  if (isGeneral) {
    insertData.customer_id = payload.customer_id
    insertData.party_name = null
  } else {
    insertData.customer_id = null
    insertData.party_name = payload.party_name?.trim() || null
  }

  const { error } = await supabase.from("account_movements").insert(insertData)

  if (error) return { error: error.message }

  await recomputeAllBalances()
  revalidate(ledger)
  return { success: true, redirectTo: monthRedirect(payload.paid_date, ledger) }
}

export async function updateMovement(id: string, formData: FormData) {
  const supabase = await getMutationClient()
  const payload = parsePayload(formData)

  try {
    accountMovementPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      return { error: e.issues[0]?.message || "Datos inválidos" }
    }
    return { error: "Datos inválidos" }
  }

  const ledger = payload.ledger || "general"
  const isGeneral = ledger === "general"

  const updateData: any = {
    ledger,
    concept: payload.concept,
    type: payload.type,
    issue_date: payload.issue_date,
    paid_date: payload.paid_date,
    amount: payload.amount,
    invoice_number: payload.invoice_number,
    updated_at: new Date().toISOString(),
  }

  if (isGeneral) {
    updateData.customer_id = payload.customer_id
    updateData.party_name = null
  } else {
    updateData.customer_id = null
    updateData.party_name = payload.party_name?.trim() || null
  }

  const { error } = await supabase
    .from("account_movements")
    .update(updateData)
    .eq("id", id)

  if (error) return { error: error.message }

  await recomputeAllBalances()
  revalidate(ledger)
  revalidatePath(`${getLedgerPath(ledger)}/${id}`)
  return { success: true, redirectTo: monthRedirect(payload.paid_date, ledger) }
}

export async function deleteMovement(id: string) {
  const supabase = await getMutationClient()

  const { data: movement } = await supabase
    .from("account_movements")
    .select("ledger")
    .eq("id", id)
    .maybeSingle()

  const ledger = movement?.ledger || "general"

  const { error } = await supabase
    .from("account_movements")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  await recomputeAllBalances()
  revalidate(ledger)
  return { success: true }
}

export async function setMonthInitialBalance(formData: FormData) {
  const supabase = await getMutationClient()
  const payload = {
    ledger: (formData.get("ledger") as string) || "general",
    year: formData.get("year") as string,
    month: formData.get("month") as string,
    initial_balance: formData.get("initial_balance") as string,
  }

  let parsed
  try {
    parsed = accountMonthConfigPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      return { error: e.issues[0]?.message || "Datos inválidos" }
    }
    return { error: "Datos inválidos" }
  }

  const ledger = parsed.ledger || "general"

  const { error } = await supabase
    .from("account_month_config")
    .upsert(
      {
        ledger,
        year: parsed.year,
        month: parsed.month,
        initial_balance: parsed.initial_balance,
      },
      { onConflict: "ledger,year,month" }
    )

  if (error) return { error: error.message }

  await recomputeAllBalances()
  revalidate(ledger)
  return { success: true }
}
