'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { approvedmicroloans } from '@/mockData/mockData'
import BusinessMicroLoanMain from '@/components/BorrowerMicroloanComponent/BusinessMicroLoan/BusinessMicroLoanMain'
import PersonalMicroLoan from '@/components/BorrowerMicroloanComponent/PersonalMicroLoan/PersonalMicroLoan'
import GroupBorrowingMain from '@/components/BorrowerMicroloanComponent/GroupBorrowingMicroLoan/GroupBorrowingMain'
const MicroLoanDetails = () => {
    const params = useParams()
    const id = params.id as string
  
    const loan = approvedmicroloans.find((loan) => loan.id === id)
  
    if (!loan) return <p className="text-red-600">MicroLoan Not Found!</p>
  
    switch (loan.type) {
      case 'Business':
        return <BusinessMicroLoanMain />
      case 'Personal':
        return <PersonalMicroLoan data = {loan}/>
      case 'Group Borrowing':
        return <GroupBorrowingMain/>
      default:
        return <p>Unknown loan type</p>
    }
  }

export default MicroLoanDetails
