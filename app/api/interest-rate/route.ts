import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const { currentRate, riskLevel } = await request.json();

  const API_KEY = process.env.GEMINI_API_KEY;
  const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

  if (!API_KEY || !ALPHA_VANTAGE_API_KEY) {
    return NextResponse.json({ error: "API Key(s) missing" }, { status: 500 });
  }

  try {
    // Fetch Federal Funds Rate
    const fedRateResponse = await fetch(
      `https://www.alphavantage.co/query?function=FEDERAL_FUNDS_RATE&interval=daily&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    // Fetch Treasury Yield
    const treasuryResponse = await fetch(
      `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!fedRateResponse.ok || !treasuryResponse.ok) {
      throw new Error("Failed to fetch market data");
    }

    const fedData = await fedRateResponse.json();
    const treasuryData = await treasuryResponse.json();

    // Extract latest rates
    const latestFedRate = parseFloat(fedData.data[0].value);
    const latestTreasuryYield = parseFloat(treasuryData.data[0].value);

    // Prepare prompt for Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a financial advisor helping determine optimal interest rates for microloans.

Given the following market data:
- Current Federal Funds Rate: ${latestFedRate}%
- Current 10-Year Treasury Yield: ${latestTreasuryYield}%
- Current Microloan Rate: ${currentRate}%
- Risk Level: ${riskLevel}

🎯 Your task:
Analyze the data and recommend an interest rate adjustment.

🧾 Output format:
Return a single clean JSON object with the following structure:

{
  "recommendedRate": number,
  "rationale": string,
  "marketAnalysis": {
    "fedRateImpact": string,
    "treasuryYieldImpact": string,
    "riskAssessment": string
  },
  "confidence": "Low" | "Medium" | "High",
  "expectedImpact": {
    "lenderProfitability": string,
    "borrowerAffordability": string
  }
}
`;

    const result = await model.generateContent(prompt);
    const apiResponse = await result.response;
    const text = apiResponse.text();

    const cleanText = text
      .replace(/```json|```/g, "")
      .replace(/,\s*([}\]])/g, "$1")
      .trim();

    const parsed = JSON.parse(cleanText);

    return NextResponse.json({ analysis: parsed });
  } catch (error) {
    console.error("🔥 Error in interest rate analysis:", error);
    return NextResponse.json(
      {
        error: "Failed to generate interest rate analysis",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
