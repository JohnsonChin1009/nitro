"use client"
import {
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const HistoryTab = () => {
    const payments = [
        {
          id: 1,
          date: "April 15, 2025",
          amount: "RM 215",
          status: "Paid",
          member: "You",
          onTime: true,
        },
        {
          id: 2,
          date: "April 15, 2025",
          amount: "RM 215",
          status: "Paid",
          member: "Ahmad Razali",
          onTime: true,
        },
        {
          id: 3,
          date: "April 15, 2025",
          amount: "RM 215",
          status: "Paid",
          member: "Li Wei",
          onTime: true,
        },
        {
          id: 4,
          date: "March 15, 2025",
          amount: "RM 215",
          status: "Paid",
          member: "You",
          onTime: true,
        },
        {
          id: 5,
          date: "March 15, 2025",
          amount: "RM 215",
          status: "Paid",
          member: "Ahmad Razali",
          onTime: true,
        },
        {
          id: 6,
          date: "March 15, 2025",
          amount: "RM 215",
          status: "Paid",
          member: "Li Wei",
          onTime: true,
        },
        {
          id: 7,
          date: "March 15, 2025",
          amount: "RM 215 + RM 25 penalty",
          status: "Late",
          member: "Raj Kumar",
          onTime: false,
        },
        {
          id: 8,
          date: "March 15, 2025",
          amount: "RM 215",
          status: "Paid",
          member: "Siti Aminah",
          onTime: true,
        },
      ]
    
      return (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Record of all payments including penalties</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.member}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>
                      {payment.status === "Paid" && payment.onTime && (
                        <div className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                          <span>On time</span>
                        </div>
                      )}
                      {payment.status === "Late" && (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-red-600" />
                          <span>Late payment</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
    }

export default HistoryTab
