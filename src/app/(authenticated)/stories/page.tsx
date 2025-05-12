"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loading } from "@/components/custom/loading"
import { toast } from "sonner"

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

interface Story {
  id: string
  application_scope: string
  definition_of_ready: string
  definition_of_done: string
  acceptance_criteria: string
  created_at: string
}

export default function StoriesListPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch stories
  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('story_info')
        .select()
        .order('created_at', { ascending: false })

      if (error) throw error
      setStories(data || [])
    } catch (err) {
      setError('Failed to fetch stories')
      console.error('Error fetching stories:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchStories()

    // Set up real-time subscription
    const channel = supabase
      .channel('story_info_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'story_info'
        },
        (payload) => {
          console.log('Change received!', payload)
          
          // Refresh the stories list
          fetchStories()

          // Show toast notification based on the event type
          switch (payload.eventType) {
            case 'INSERT':
              toast.success('New story added')
              break
            case 'UPDATE':
              toast.info('Story updated')
              break
            case 'DELETE':
              toast.warning('Story removed')
              break
          }
        }
      )
      .subscribe()

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Stories</h1>
        <p className="mt-2 text-muted-foreground">
          A comprehensive list of all user stories and their agile definitions
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application Scope</TableHead>
              <TableHead>Definition of Ready</TableHead>
              <TableHead>Definition of Done</TableHead>
              <TableHead>Acceptance Criteria</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No stories found
                </TableCell>
              </TableRow>
            ) : (
              stories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell className="font-medium max-w-[200px] break-words whitespace-normal">
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 