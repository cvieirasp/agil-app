"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loading } from "@/components/custom/loading"

interface Story {
  id: string
  story_code: string
  application_scope: string
  definition_of_ready: string
  definition_of_done: string
  acceptance_criteria: string
  created_at: string
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (!response.ok) throw new Error('Failed to fetch stories')
      
      const data = await response.json()
      setStories(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching stories:', err)
      setError('Failed to load stories')
      toast.error('Failed to load stories')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchStories()

    // Set up SSE connection
    const eventSource = new EventSource('/api/stories/events')

    eventSource.onmessage = (event) => {
      if (event.data === 'connected') {
        console.log('SSE connected')
        return
      }

      try {
        const payload = JSON.parse(event.data)
        console.log('Received update:', payload)

        // Refresh stories when we receive an update
        fetchStories()

        // Show toast notification based on event type
        switch (payload.eventType) {
          case 'INSERT':
            toast.success('New story added')
            break
          case 'UPDATE':
            toast.success('Story updated')
            break
          case 'DELETE':
            toast.success('Story removed')
            break
        }
      } catch (err) {
        console.error('Error processing SSE message:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error:', err)
      eventSource.close()
      toast.error('Lost connection to server')
    }

    // Cleanup on unmount
    return () => {
      eventSource.close()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Stories List</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your user stories, including their definitions and acceptance criteria.
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No stories found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Story Code</TableHead>
                <TableHead>Application Scope</TableHead>
                <TableHead>Definition of Ready</TableHead>
                <TableHead>Definition of Done</TableHead>
                <TableHead>Acceptance Criteria</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell className="whitespace-nowrap">
                    {story.story_code}
                  </TableCell>
                  <TableCell className="max-w-[200px] break-words whitespace-normal">
                    {story.application_scope}
                  </TableCell>
                  <TableCell className="max-w-[200px] break-words whitespace-normal">
                    {story.definition_of_ready}
                  </TableCell>
                  <TableCell className="max-w-[200px] break-words whitespace-normal">
                    {story.definition_of_done}
                  </TableCell>
                  <TableCell className="max-w-[200px] break-words whitespace-normal">
                    {story.acceptance_criteria}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(story.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 