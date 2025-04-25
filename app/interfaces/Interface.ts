import { ReactNode } from "react";

export interface Reward {
    id: number;
    name: string;
    description: string;
    points: number;
    icon: ReactNode;
    available: boolean;
}


export interface Microloan {
    id: string
    applicantName: string
    amount: number
    purpose: string
    riskScore: number
    riskExplanation: string
    aiInsights: string | null;
    votes: {
      approve: number
      reject: number
      total: number
    }
    endDate: string
  
    // ★ these must match exactly what your API/model expects ★
    StatedMonthlyIncome: number
    DebtToIncomeRatio: number
    DelinquenciesLast7Years: number
    CreditGrade: string
    ProsperRatingAlpha: string
    BorrowerState: string
    Occupation: string
    EmploymentStatus: string
    IncomeRange: string
  }