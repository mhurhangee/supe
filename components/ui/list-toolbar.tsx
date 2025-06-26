'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { cn } from '@/lib/utils'

import { ArrowDown, ArrowUp, Search } from 'lucide-react'

import { Button } from './button'
import { Input } from './input'

export type SortOrder = 'asc' | 'desc'

interface ListToolbarProps {
  search: string
  onSearch: (q: string) => void
  sort: string
  sortOrder: SortOrder
  onSort: (field: string) => void
  onToggleSortOrder: () => void
  sortOptions: { value: string; label: string }[]
  className?: string
  children?: React.ReactNode
}

export function ListToolbar({
  search,
  onSearch,
  sort,
  sortOrder,
  onSort,
  onToggleSortOrder,
  sortOptions,
  className,
  children,
}: ListToolbarProps) {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {/* Search always full width */}
      <div className="relative w-full">
        <Input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search..."
          className="pl-8"
        />
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
      </div>
      {/* Sort and view toggle on the same line (mobile and up) */}
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="flex w-full max-w-xs gap-2">
          <Select value={sort} onValueChange={onSort}>
            <SelectTrigger id="sort" className="h-8 w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSortOrder}
            aria-label="Toggle sort order"
            className="h-8 w-8"
          >
            {sortOrder === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex flex-shrink-0 justify-end">{children}</div>
      </div>
    </div>
  )
}
