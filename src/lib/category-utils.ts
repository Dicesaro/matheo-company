export interface CategoryWithParent {
  id: string
  name: string
  parent_id: string | null
  image_url?: string | null
}

export interface CategoryNode {
  id: string
  name: string
  parent_id: string | null
  image_url?: string | null
  children: CategoryNode[]
}

export function buildCategoryTree(categories: CategoryWithParent[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>()
  const roots: CategoryNode[] = []

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] })
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

export function getSubcategories(
  parentId: string,
  categories: CategoryWithParent[],
): CategoryWithParent[] {
  return categories.filter((c) => c.parent_id === parentId)
}

export function hasSubcategories(
  categoryId: string,
  categories: CategoryWithParent[],
): boolean {
  return categories.some((c) => c.parent_id === categoryId)
}

export function getParentCategory(
  categoryId: string,
  categories: CategoryWithParent[],
): CategoryWithParent | null {
  const cat = categories.find((c) => c.id === categoryId)
  if (!cat?.parent_id) return null
  return categories.find((c) => c.id === cat.parent_id) || null
}

export function getAllDescendantIds(
  categoryId: string,
  categories: CategoryWithParent[],
): string[] {
  const ids: string[] = [categoryId]
  const children = getSubcategories(categoryId, categories)
  for (const child of children) {
    ids.push(...getAllDescendantIds(child.id, categories))
  }
  return ids
}
