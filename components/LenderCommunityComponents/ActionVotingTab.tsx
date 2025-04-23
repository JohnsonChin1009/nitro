"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Check, Clock, AlertCircle } from "lucide-react"
import { LenderRewardModal } from "../LenderRewardsModal"

type VoteOption = {
  id: number
  label: string
  votes: number
}

type ActionProposal = {
  id: number
  title: string
  description: string
  status: "active" | "completed" | "pending"
  deadline: string
  totalVotes: number
  options: VoteOption[]
  userVoted: boolean
}

const initialProposals: ActionProposal[] = [
  {
    id: 1,
    title: "Treasury Allocation for Q3",
    description: "How should we allocate the community treasury funds for the upcoming quarter?",
    status: "active",
    deadline: "2 days left",
    totalVotes: 156,
    options: [
      { id: 1, label: "Increase development funding", votes: 78 },
      { id: 2, label: "Focus on marketing initiatives", votes: 45 },
      { id: 3, label: "Community events and education", votes: 33 },
    ],
    userVoted: false,
  },
  {
    id: 2,
    title: "Protocol Upgrade Proposal",
    description: "Vote on the implementation timeline for the upcoming protocol upgrade.",
    status: "active",
    deadline: "5 days left",
    totalVotes: 203,
    options: [
      { id: 1, label: "Implement within 2 weeks", votes: 89 },
      { id: 2, label: "Implement within 1 month", votes: 67 },
      { id: 3, label: "Delay until further testing", votes: 47 },
    ],
    userVoted: true,
  },
  {
    id: 3,
    title: "Governance Structure Changes",
    description: "Should we modify our current governance structure to include more community representation?",
    status: "completed",
    deadline: "Ended 3 days ago",
    totalVotes: 278,
    options: [
      { id: 1, label: "Yes, expand community representation", votes: 189 },
      { id: 2, label: "No, maintain current structure", votes: 89 },
    ],
    userVoted: true,
  },
]

export default function ActionVotingTab() {
  const [proposals, setProposals] = useState<ActionProposal[]>(initialProposals)
  const [newProposalOpen, setNewProposalOpen] = useState(false)
  const [newProposalTitle, setNewProposalTitle] = useState("")
  const [newProposalDescription, setNewProposalDescription] = useState("")
  const [newProposalOptions, setNewProposalOptions] = useState(["", ""])
  const [newProposalDeadline, setNewProposalDeadline] = useState("")

  const [voteDialogOpen, setVoteDialogOpen] = useState(false)
  const [currentProposal, setCurrentProposal] = useState<ActionProposal | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)


  const handleOpenVoteDialog = (proposal: ActionProposal) => {
    setCurrentProposal(proposal)
    setSelectedOption(null)
    setVoteDialogOpen(true)
  }

  const handleVote = () => {
    if (!currentProposal || selectedOption === null) return

    // Calculate random rewards (you can replace with your actual reward logic)
    const pointsEarned = Math.floor(Math.random() * 50) + 10
    const xpEarned = Math.floor(Math.random() * 20) + 5

   

    setProposals((prev) =>
      prev.map((proposal) => {
        if (proposal.id === currentProposal.id) {
          return {
            ...proposal,
            userVoted: true,
            totalVotes: proposal.totalVotes + 1,
            options: proposal.options.map((option) =>
              option.id === selectedOption ? { ...option, votes: option.votes + 1 } : option,
            ),
          }
        }
        return proposal
      }),
    )

    setVoteDialogOpen(false)
    setRewardDialogOpen(true)
  }

  const handleAddOption = () => {
    setNewProposalOptions([...newProposalOptions, ""])
  }

  const handleChangeOption = (index: number, value: string) => {
    const updatedOptions = [...newProposalOptions]
    updatedOptions[index] = value
    setNewProposalOptions(updatedOptions)
  }

  const handleCreateProposal = () => {
    if (!newProposalTitle.trim() || !newProposalDescription.trim() || !newProposalDeadline) return

    // Filter out empty options
    const filteredOptions = newProposalOptions.filter((option) => option.trim() !== "")
    if (filteredOptions.length < 2) return

    const newProposal: ActionProposal = {
      id: proposals.length + 1,
      title: newProposalTitle,
      description: newProposalDescription,
      status: "active",
      deadline: `${newProposalDeadline} days left`,
      totalVotes: 0,
      options: filteredOptions.map((option, index) => ({
        id: index + 1,
        label: option,
        votes: 0,
      })),
      userVoted: false,
    }

    setProposals([newProposal, ...proposals])
    setNewProposalTitle("")
    setNewProposalDescription("")
    setNewProposalOptions(["", ""])
    setNewProposalDeadline("")
    setNewProposalOpen(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0
    return Math.round((votes / total) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Action Proposals</h2>
        <Dialog open={newProposalOpen} onOpenChange={setNewProposalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>New Proposal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
              <DialogDescription>Create a new proposal for the community to vote on.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter proposal title"
                  value={newProposalTitle}
                  onChange={(e) => setNewProposalTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your proposal"
                  className="min-h-[100px]"
                  value={newProposalDescription}
                  onChange={(e: any) => setNewProposalDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Voting Options</Label>
                {newProposalOptions.map((option, index) => (
                  <Input
                    key={index}
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleChangeOption(index, e.target.value)}
                    className="mb-2"
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (days)</Label>
                <Input
                  id="deadline"
                  type="number"
                  placeholder="Enter number of days"
                  min="1"
                  value={newProposalDeadline}
                  onChange={(e) => setNewProposalDeadline(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProposal}>Create Proposal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {proposals.map((proposal) => (
          <Card key={proposal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{proposal.title}</CardTitle>
                  <CardDescription className="mt-2">{proposal.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(proposal.status)}
                  <span
                    className={`text-sm font-medium ${
                      proposal.status === "active"
                        ? "text-blue-500"
                        : proposal.status === "completed"
                          ? "text-green-500"
                          : "text-yellow-500"
                    }`}
                  >
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>{proposal.totalVotes} votes</span>
                  <span>{proposal.deadline}</span>
                </div>

                {proposal.options.map((option) => (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{option.label}</span>
                      <span>
                        {calculatePercentage(option.votes, proposal.totalVotes)}% ({option.votes})
                      </span>
                    </div>
                    <Progress value={calculatePercentage(option.votes, proposal.totalVotes)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              {proposal.status === "active" && !proposal.userVoted ? (
                <Button onClick={() => handleOpenVoteDialog(proposal)} className="w-full">
                  Cast Your Vote
                </Button>
              ) : proposal.userVoted ? (
                <Button variant="outline" disabled className="w-full">
                  You've Voted
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  Voting Closed
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={voteDialogOpen} onOpenChange={setVoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProposal?.title}</DialogTitle>
            <DialogDescription>{currentProposal?.description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup
              value={selectedOption?.toString()}
              onValueChange={(value: any) => setSelectedOption(Number.parseInt(value))}
            >
              {currentProposal?.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button onClick={handleVote} disabled={selectedOption === null}>
              Submit Vote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <LenderRewardModal
           isOpen={rewardDialogOpen}
           onClose={ ()=>setRewardDialogOpen(false)}
           title={"Thank Your for Your Thoughts"}
           description={"Your Opinion will be reviwed"}
           points={20}
           experienceGained={10}

      />
    </div>
  )
}
