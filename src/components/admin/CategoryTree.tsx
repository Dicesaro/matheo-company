'use client'

import { useState } from 'react'
import { ChevronRight, FolderOpen, Pencil, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { deleteCategory } from '@/lib/actions/categories'
import type { CategoryNode } from '@/lib/category-utils'
import DeleteButton from '@/components/admin/DeleteButton'
import ButtonLink from '@/components/admin/ButtonLink'

function TreeRow({
  node,
  depth = 0,
  expandedParentId,
  onToggle,
}: {
  node: CategoryNode
  depth?: number
  expandedParentId: string | null
  onToggle: (id: string) => void
}) {
  const isParent = node.children.length > 0
  const isExpanded = expandedParentId === node.id

  return (
    <>
      <TableRow className={`border-b border-gray-50 transition-all duration-200 hover:bg-gray-50/50 ${depth > 0 ? 'animate-[slideDown_0.3s_ease-out]' : ''}`}>
        <TableCell className="px-4 py-3 w-6">
          <div className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]" />
        </TableCell>
        <TableCell className="px-4 py-3 font-medium text-gray-900">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 28}px` }}>
            {depth > 0 && (
              <div className="h-px w-4 shrink-0 bg-gray-200" />
            )}
            {isParent ? (
              <button
                type="button"
                onClick={() => onToggle(node.id)}
                className="focus:outline-none"
              >
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            ) : (
              <div className="w-3.5 shrink-0" />
            )}
            <span className={depth > 0 ? 'text-gray-600' : ''}>{node.name}</span>
            {depth === 0 && isParent && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                {node.children.length}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell className="px-4 py-3">
          <div className="flex items-center">
            {node.image_url ? (
              <Image
                src={node.image_url}
                alt={node.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover ring-1 ring-gray-100"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 ring-1 ring-gray-100">
                <ImageIcon className="h-4 w-4 text-gray-300" />
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="px-4 py-3">
          <div className="flex items-center gap-1">
            <ButtonLink
              variant="ghost"
              size="icon"
              href={`/admin/categorias/${node.id}`}
            >
              <Pencil className="h-4 w-4 text-gray-400 transition-colors hover:text-matheo-red" />
            </ButtonLink>
            <DeleteButton
              id={node.id}
              action={deleteCategory}
              label={node.name}
            />
          </div>
        </TableCell>
      </TableRow>
      {isExpanded &&
        node.children.map((child) => (
          <TreeRow
            key={child.id}
            node={child}
            depth={depth + 1}
            expandedParentId={expandedParentId}
            onToggle={onToggle}
          />
        ))}
    </>
  )
}

interface CategoryTreeProps {
  tree: CategoryNode[]
  countParents: number
  countSubcategories: number
}

export default function CategoryTree({ tree, countParents, countSubcategories }: CategoryTreeProps) {
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedParentId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Todas las categorías
        </h2>
        <span className="text-xs text-gray-400">
          {countParents} categoría{countParents !== 1 && 's'}
          {countSubcategories > 0
            ? `, ${countSubcategories} subcategoría${countSubcategories !== 1 && 's'}`
            : ''}
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-50">
            <TableHead className="h-10 w-6 px-4" />
            <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Nombre
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Imagen
            </TableHead>
            <TableHead className="h-10 w-24 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tree.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-sm text-gray-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <FolderOpen className="h-8 w-8 text-gray-300" />
                  <p>No hay categorías registradas</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tree.map((node) => (
              <TreeRow
                key={node.id}
                node={node}
                expandedParentId={expandedParentId}
                onToggle={handleToggle}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
