"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Eye, Trash2, Search } from "lucide-react"
import ReactMarkdown from "react-markdown"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loading } from "@/components/custom/loading"
import { Breadcrumbs } from "@/components/custom/breadcrumbs"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/custom/confirm-dialog"
import { Input } from "@/components/ui/input"
import { RealtimeSubscription } from "@/components/custom/realtime-subscription"

interface Story {
  id: string
  story_code: string
  application_scope: string
  definition_of_ready: string
  definition_of_done: string
  acceptance_criteria: string
  created_at: string
}

// Add debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Add these methods before the StoriesPage component
async function getStories() {
  try {
    const response = await fetch('/api/stories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch stories');
    }

    // Return the data in the expected format
    return {
      success: true,
      stories: data.stories || []
    };
  } catch (error) {
    console.error('Error in getStories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stories'
    };
  }
}

async function deleteStory(id: string) {
  try {
    const response = await fetch(`/api/stories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete story');
    }

    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Error in deleteStory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete story'
    };
  }
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [filteredStories, setFilteredStories] = useState<Story[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300) // 300ms delay
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null)

  // Use a callback to ensure stability for the RealtimeSubscription dependency
  const fetchStories = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Use server action to fetch stories
      const result = await getStories()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch stories')
      }
      
      setStories(result.stories || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching stories:', err)
      setError('Failed to load stories')
      toast.error('Failed to load stories')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDelete = async (id: string) => {
    try {
      // Use server action to delete story
      const result = await deleteStory(id)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete story')
      }
      
      toast.success('Story deleted successfully')
      setStoryToDelete(null) // Close the dialog
      fetchStories() // Refresh the list
    } catch (err) {
      console.error('Error deleting story:', err)
      toast.error('Failed to delete story')
    }
  }

  const handleViewDetails = (id: string) => {
    // TODO: Implement view details functionality
    console.log('View details for story:', id)
  }

  useEffect(() => {
    // Initial fetch
    fetchStories()
  }, [])

  useEffect(() => {
    const filtered = stories?.filter(story =>
      story.story_code.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )
    setFilteredStories(filtered || [])
  }, [debouncedSearchQuery, stories])

  if (isLoading && stories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    )
  }

  if (error && stories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add the real-time subscription component */}
      <RealtimeSubscription 
        onDataChange={fetchStories} 
        tableName="story_info" 
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stories List</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your user stories, including their definitions and acceptance criteria.
          </p>
        </div>
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Stories" }
          ]}
        />
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No stories found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Story Code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Story Code</TableHead>
                  <TableHead className="font-semibold">Application Scope</TableHead>
                  <TableHead className="font-semibold">Definition of Ready</TableHead>
                  <TableHead className="font-semibold">Definition of Done</TableHead>
                  <TableHead className="font-semibold">Acceptance Criteria</TableHead>
                  <TableHead className="font-semibold">Created Date</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStories.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell className="whitespace-nowrap w-max-[200px]">
                      {story.story_code}
                    </TableCell>
                    <TableCell className="break-words whitespace-normal max-w-[400px] ">
                      {story.application_scope}
                    </TableCell>
                    <TableCell className="break-words whitespace-normal">
                      <ReactMarkdown>{story.definition_of_ready}</ReactMarkdown>
                    </TableCell>
                    <TableCell className="break-words whitespace-normal">
                      <ReactMarkdown>{story.definition_of_done}</ReactMarkdown>
                    </TableCell>
                    <TableCell className="break-words whitespace-normal">
                      <ReactMarkdown>{story.acceptance_criteria}</ReactMarkdown>
                    </TableCell>
                    <TableCell className="whitespace-nowrap w-max-[200px]">
                      {new Date(story.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(story.id)}
                          title="View Details"
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setStoryToDelete(story)}
                          title="Delete Story"
                          className="text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!storyToDelete}
        onClose={() => setStoryToDelete(null)}
        onConfirm={() => storyToDelete && handleDelete(storyToDelete.id)}
        title="Delete Story"
        description={`Are you sure you want to delete the story "${storyToDelete?.story_code}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  )
} 