'use client'

import { FolderClosed, FoldersIcon } from "lucide-react"

import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ListToolbar } from '@/components/ui/list-toolbar'

import { CreateProjectDialog } from '@/components/project-create-dialog'
import { ProjectsList } from '@/components/projects-list'
import { HubLayout } from '@/components/hub-layout'

import { fetcher } from '@/lib/utils'

import type { Project } from '@/lib/types/projects'

import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'

export default function ProjectsPage() {
    const { data, error, isLoading } = useSWR<{ projects: Project[] }>('/api/project', fetcher)

    // Toolbar state
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<'title' | 'updatedAt'>('updatedAt')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    useEffect(() => {
        if (error) toast.error('Failed to load projects')
    }, [error])

    // Filtering and sorting logic
    const filteredProjects = useMemo(() => {
        if (!data?.projects) return []
        let result = data.projects
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(
                p =>
                    p.title.toLowerCase().includes(q) ||
                    (p.description?.toLowerCase().includes(q) ?? false) ||
                    p.tags?.some(tag => tag.toLowerCase().includes(q))
            )
        }
        result = [...result].sort((a, b) => {
            let cmp = 0
            if (sort === 'title') cmp = a.title.localeCompare(b.title)
            else if (sort === 'updatedAt')
                cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
            return sortOrder === 'asc' ? cmp : -cmp
        })
        return result
    }, [data?.projects, search, sort, sortOrder])

    return (
        <HubLayout
            title={<span className="flex items-center gap-2">Projects</span>}
            description="A list of your AI project workspaces."
            icon={<FoldersIcon />}
            breadcrumbs={[{ label: 'Projects' }]}
            actions={
                <div className="flex items-center gap-3">
                    <CreateProjectDialog onCreated={() => mutate('/api/project')}>
                        <Button className="cursor-pointer">Create Project</Button>
                    </CreateProjectDialog>
                </div>
            }
        >
            <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
                <ListToolbar
                    search={search}
                    onSearch={setSearch}
                    sort={sort}
                    sortOrder={sortOrder}
                    onSort={v => setSort(v as 'title' | 'updatedAt')}
                    onToggleSortOrder={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
                    sortOptions={[
                        { value: 'updatedAt', label: 'Last Updated' },
                        { value: 'title', label: 'Title' },
                    ]}
                />
            </div>
            <ProjectsList
                projects={filteredProjects}
                isLoading={isLoading}
            />
        </HubLayout>
    )
}