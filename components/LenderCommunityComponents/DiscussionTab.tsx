"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, MessageCircle } from "lucide-react"
import { LenderRewardModal } from "../LenderRewardsModal"

type Post = {
  id: number
  author: string
  authorAvatar: string
  title: string
  content: string
  timestamp: string
  likes: number
  comments: Comment[]
}

type Comment = {
  id: number
  author: string
  authorAvatar: string
  content: string
  timestamp: string
  likes: number
}

// Sample data
const initialPosts: Post[] = [
  {
    id: 1,
    author: "Jane Smith",
    authorAvatar: "JS",
    title: "Thoughts on the new governance model",
    content:
      "I believe we should consider implementing a more decentralized approach to decision making. What do you all think?",
    timestamp: "2 hours ago",
    likes: 24,
    comments: [
      {
        id: 1,
        author: "Alex Johnson",
        authorAvatar: "AJ",
        content: "I completely agree. Decentralization is the way forward for our community.",
        timestamp: "1 hour ago",
        likes: 8,
      },
      {
        id: 2,
        author: "Sam Wilson",
        authorAvatar: "SW",
        content: "While I see your point, we need to consider the implementation challenges.",
        timestamp: "45 minutes ago",
        likes: 3,
      },
    ],
  },
  {
    id: 2,
    author: "Mark Davis",
    authorAvatar: "MD",
    title: "Proposal for community events",
    content:
      "I'd like to propose a monthly virtual meetup to discuss ongoing projects and initiatives. This could help improve collaboration.",
    timestamp: "5 hours ago",
    likes: 18,
    comments: [],
  },
]

export default function DiscussionTab() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [expandedComments, setExpandedComments] = useState<number[]>([1])
  const [newComments, setNewComments] = useState<Record<number, string>>({})
  const [isRewardModalOpen, setRewardModal] = useState(false);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return

    const newPost: Post = {
      id: posts.length + 1,
      author: "Current User",
      authorAvatar: "CU",
      title: newPostTitle,
      content: newPostContent,
      timestamp: "Just now",
      likes: 0,
      comments: [],
    }

    setPosts([newPost, ...posts])
    setNewPostTitle("")
    setNewPostContent("")
    setRewardModal(true);
  }

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const handleAddComment = (postId: number) => {
    if (!newComments[postId]?.trim()) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: post.comments.length + 1,
            author: "Current User",
            authorAvatar: "CU",
            content: newComments[postId],
            timestamp: "Just now",
            likes: 0,
          }
          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      }),
    )

    setNewComments((prev) => ({
      ...prev,
      [postId]: "",
    }))
  }

  const handleLikePost = (postId: number) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const handleLikeComment = (postId: number, commentId: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
            ),
          }
        }
        return post
      }),
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Discussion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Title" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
          <Textarea
            placeholder="Share your thoughts with the community..."
            className="min-h-[120px]"
            value={newPostContent}
            onChange={(e:any) => setNewPostContent(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreatePost}>Post Discussion</Button>
        </CardFooter>
      </Card>

      <hr/>
      <h2 className=" text-xl font-bold">Latest Posts</h2>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Avatar>
                  <AvatarFallback>{post.authorAvatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
              <CardTitle className="text-xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="flex gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleLikePost(post.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments.length}</span>
                </Button>
              </div>
            </CardFooter>

            {expandedComments.includes(post.id) && (
              <div className="border-t p-4 space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{comment.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                        </div>
                        <p className="mt-1 text-sm">{comment.content}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 mt-1"
                        onClick={() => handleLikeComment(post.id, comment.id)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span className="text-xs">{comment.likes}</span>
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 mt-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">CU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComments[post.id] || ""}
                      onChange={(e) =>
                        setNewComments((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      className="text-sm"
                    />
                    <Button size="sm" onClick={() => handleAddComment(post.id)}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      <LenderRewardModal
            isOpen={isRewardModalOpen}
            onClose={ ()=>setRewardModal(false)}
            title={"Thank Your for Your Thoughts"}
            description={"Your Opinion will be reviwed"}
            points={20}
            experienceGained={10}
        />
    </div>
  )
}
