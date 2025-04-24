"use client"
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const MembersTab = () => {
    const members = [
        {
          id: 1,
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          purpose: "Purchasing a washing machine",
          amount: "RM 2,500",
          status: "Paid",
          paymentStatus: "on-time",
        },
        {
          id: 2,
          name: "Ahmad Razali",
          avatar: "/placeholder.svg?height=40&width=40",
          purpose: "Home renovation",
          amount: "RM 2,500",
          status: "Paid",
          paymentStatus: "on-time",
        },
        {
          id: 3,
          name: "Siti Aminah",
          avatar: "/placeholder.svg?height=40&width=40",
          purpose: "Education fees",
          amount: "RM 2,500",
          status: "Pending",
          paymentStatus: "upcoming",
        },
        {
          id: 4,
          name: "Raj Kumar",
          avatar: "/placeholder.svg?height=40&width=40",
          purpose: "Medical expenses",
          amount: "RM 2,500",
          status: "Late",
          paymentStatus: "overdue",
        },
        {
          id: 5,
          name: "Li Wei",
          avatar: "/placeholder.svg?height=40&width=40",
          purpose: "Business startup",
          amount: "RM 2,500",
          status: "Paid",
          paymentStatus: "on-time",
        },
      ]
    
      return (
        <Card>
          <CardHeader>
            <CardTitle>Group Members</CardTitle>
            <CardDescription>All members and their loan purposes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.purpose}</TableCell>
                    <TableCell>{member.amount}</TableCell>
                    <TableCell>
                      {member.status === "Paid" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                      )}
                      {member.status === "Pending" && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                          Pending
                        </Badge>
                      )}
                      {member.status === "Late" && <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Late</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
}

export default MembersTab
