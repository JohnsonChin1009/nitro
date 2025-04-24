// Mock data - in a real app this would come from your Web3 connection
import { Microloan } from "@/interfaces/Interface"
import { Award, Wallet, TrendingUp, Users, Zap, ChevronRight, Sparkles } from "lucide-react"

type MicroloanType = "Business" | "Personal" | "Group Borrowing"
type RiskLevel = "Low" | "Medium" | "High"

interface MicroloanApproved {
  id: string
  name: string
  type: MicroloanType
  riskScore: {
    level: RiskLevel
    value: number // Out of 100
  }
  interestRate: number
  amount: number
  currency: string
}


export const mockUserData = {
    name: "Johnson",
    handle: "@johnson",
    level: 3,
    xp: 2750,
    xpToNextLevel: 4000,
    totalPooled: 15420,
    profileImage: "/placeholder.svg?height=100&width=100",
    joinDate: "January 2025",
    pools: [
      { id: 1, name: "Agriculture", amount: 5000, apy: 8.2, color: "bg-emerald-500" },
      { id: 2, name: "Education", amount: 3200, apy: 7.5, color: "bg-blue-500" },
      { id: 3, name: "Small Business", amount: 4800, apy: 9.1, color: "bg-purple-500" },
      { id: 4, name: "Healthcare", amount: 2420, apy: 6.8, color: "bg-pink-500" },
    ],
    perks: [
      { level: 1, name: "Basic Returns", description: "Standard APY on all pools", icon: <Wallet className="h-5 w-5" /> },
      {
        level: 2,
        name: "Priority Access",
        description: "Early access to new pools",
        icon: <ChevronRight className="h-5 w-5" />,
      },
      {
        level: 3,
        name: "Enhanced Returns",
        description: "+0.5% APY on all pools",
        icon: <TrendingUp className="h-5 w-5" />,
      },
      { level: 4, name: "Reduced Fees", description: "25% lower platform fees", icon: <Zap className="h-5 w-5" /> },
      {
        level: 5,
        name: "Governance Rights",
        description: "Voting rights on new pools",
        icon: <Users className="h-5 w-5" />,
      },
    ],
  }


  export const mockMicroloans: Microloan[] = [
    {
      id: "1",
      applicantName: "Maria Rodriguez",
      amount: 3500,
      purpose: "Expanding small grocery store",
      riskScore: 8,
      riskExplanation:
        "Previous loan default, limited business history, and high local competition in the area.",
      aiInsights: null,
      votes: { approve: 12, reject: 8, total: 20 },
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  
      // — the fields your model expects —
      StatedMonthlyIncome: 3000,
      DebtToIncomeRatio: 0.40,
      DelinquenciesLast7Years: 2,
      CreditGrade: "C",
      ProsperRatingAlpha: "B",
      BorrowerState: "CO",
      Occupation: "Other",
      EmploymentStatus: "Self-employed",
      IncomeRange: "$25,000-49,999",
    },
    {
      id: "2",
      applicantName: "John Mwangi",
      amount: 2000,
      purpose: "Agricultural equipment purchase",
      riskScore: 7,
      riskExplanation:
        "Seasonal income dependency, weather risks, and limited collateral.",
      aiInsights: null,
      votes: { approve: 18, reject: 5, total: 23 },
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  
      StatedMonthlyIncome: 250000,
      DebtToIncomeRatio: 0,
      DelinquenciesLast7Years: 1,
      CreditGrade: "C",
      ProsperRatingAlpha: "A",
      BorrowerState: "GA",
      Occupation: "Other",
      EmploymentStatus: "Employed",
      IncomeRange: "$25,000-49,999",
    },
    {
      id: "3",
      applicantName: "Priya Sharma",
      amount: 500,
      purpose: "Textile workshop expansion",
      riskScore: 9,
      riskExplanation:
        "High debt-to-income ratio, volatile industry, and recent market downturn in textiles.",
      aiInsights: null,
      votes: { approve: 7, reject: 15, total: 22 },
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  
      StatedMonthlyIncome: 1000,
      DebtToIncomeRatio: 100,
      DelinquenciesLast7Years: 3,
      CreditGrade: "D",
      ProsperRatingAlpha: "B",
      BorrowerState: "GA",
      Occupation: "Other",
      EmploymentStatus: "Employed",
      IncomeRange: "$25,000-49,999",
    },
    {
      id: "4",
      applicantName: "Carlos Mendoza",
      amount: 1500,
      purpose: "Food truck repairs",
      riskScore: 6,
      riskExplanation:
        "Inconsistent income history, competitive market, but good repayment record on previous loans.",
      aiInsights: null,
      votes: { approve: 25, reject: 10, total: 35 },
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  
      StatedMonthlyIncome: 1500,
      DebtToIncomeRatio: 0.24,
      DelinquenciesLast7Years: 1,
      CreditGrade: "B",
      ProsperRatingAlpha: "A",
      BorrowerState: "CO",
      Occupation: "Other",
      EmploymentStatus: "Employed",
      IncomeRange: "$0-24,999",
    },
    {
      id: "5",
      applicantName: "Fatima Al-Hassan",
      amount: 4000,
      purpose: "Artisanal craft business",
      riskScore: 8,
      riskExplanation:
        "New business venture, limited market validation, and high startup costs relative to projected income.",
      aiInsights: null,
      votes: { approve: 9, reject: 11, total: 20 },
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
  
      StatedMonthlyIncome: 3000,
      DebtToIncomeRatio: 0.30,
      DelinquenciesLast7Years: 2,
      CreditGrade: "C",
      ProsperRatingAlpha: "C",
      BorrowerState: "CA",
      Occupation: "Other",
      EmploymentStatus: "Not available",
      IncomeRange: "$25,000-49,999",
    },
    {
      id: "6",
      applicantName: "Nguyen Van Minh",
      amount: 2500,
      purpose: "Fishing equipment upgrade",
      riskScore: 7,
      riskExplanation:
        "Environmental risks, fluctuating market prices, and limited alternative income sources.",
      aiInsights: null,
      votes: { approve: 15, reject: 12, total: 27 },
      endDate: new Date(
        Date.now() + 3.5 * 24 * 60 * 60 * 1000
      ).toISOString(),
  
      StatedMonthlyIncome: 2400,
      DebtToIncomeRatio: 0.35,
      DelinquenciesLast7Years: 1,
      CreditGrade: "C",
      ProsperRatingAlpha: "D",
      BorrowerState: "GA",
      Occupation: "Other",
      EmploymentStatus: "Employed",
      IncomeRange: "$25,000-49,999",
    },
  ]

  export const assetitems = [
    {
      id: "1",
      image: "/placeholder.svg?height=400&width=600",
      title: "Premium Subscription",
      description: "Get access to all premium features for one month.",
      pointsNeeded: 500,
    },
    {
      id: "2",
      image: "/placeholder.svg?height=400&width=600",
      title: "Gift Card",
      description: "Redeem a $25 gift card for your favorite store.",
      pointsNeeded: 1000,
    },
    {
      id: "3",
      image: "/placeholder.svg?height=400&width=600",
      title: "Exclusive Webinar",
      description: "Join our exclusive webinar with industry experts.",
      pointsNeeded: 300,
    },
    {
      id: "4",
      image: "/placeholder.svg?height=400&width=600",
      title: "Custom Merchandise",
      description: "Get a branded t-shirt, mug, or other merchandise.",
      pointsNeeded: 750,
    },
    {
      id: "5",
      image: "/placeholder.svg?height=400&width=600",
      title: "VIP Support",
      description: "Priority support for all your questions for 3 months.",
      pointsNeeded: 600,
    },
    {
      id: "6",
      image: "/placeholder.svg?height=400&width=600",
      title: "Early Access",
      description: "Get early access to new features before they're released.",
      pointsNeeded: 450,
    },
  ]


  export const swagitems = [
    {
      id: "1",
      image: "/swag/headphones.svg?height=400&width=600",
      title: "Noise-Cancelling Headphones",
      description: "Enjoy your music and meetings with premium headphones.",
      pointsNeeded: 1200,
    },
    {
      id: "2",
      image: "/swag/waterbottle.svg?height=400&width=600",
      title: "Eco-Friendly Water Bottle",
      description: "Stay hydrated with a reusable branded water bottle.",
      pointsNeeded: 300,
    },
    {
      id: "3",
      image: "/swag/laptopstand.svg?height=400&width=600",
      title: "Ergonomic Laptop Stand",
      description: "Improve posture with this sleek, portable laptop stand.",
      pointsNeeded: 700,
    },
    {
      id: "4",
      image: "/swag/notebook.svg?height=400&width=600",
      title: "Leather Notebook",
      description: "A premium notebook for your notes, doodles, and plans.",
      pointsNeeded: 250,
    },
    {
      id: "5",
      image: "/swag/stickers.svg?height=400&width=600",
      title: "Sticker Pack",
      description: "Decorate your laptop with a pack of fun, branded stickers.",
      pointsNeeded: 150,
    },
    {
      id: "6",
      image: "/swag/hoodie.svg?height=400&width=600",
      title: "Limited Edition Hoodie",
      description: "Snag this comfy hoodie with our exclusive event design.",
      pointsNeeded: 1000,
    },
  ];

  export const approvedmicroloans: MicroloanApproved[] = [
    {
      id: "small-business-starter-ml2023",
      name: "Small Business Starter",
      type: "Business",
      riskScore: {
        level: "Medium",
        value: 58,
      },
      interestRate: 4.5,
      amount: 15000,
      currency: "MYR",
    },
    {
      id: "purchase-bicycle-p2023x",
      name: "Purchase of Bicycle",
      type: "Personal",
      riskScore: {
        level: "Low",
        value: 32,
      },
      interestRate: 3.2,
      amount: 2500,
      currency: "MYR",
    },
    {
      id: "washing-machine-gb2023y",
      name: "Purchase of New Washing Machine",
      type: "Group Borrowing",
      riskScore: {
        level: "Low",
        value: 25,
      },
      interestRate: 2.8,
      amount: 3800,
      currency: "MYR",
    },
  ]