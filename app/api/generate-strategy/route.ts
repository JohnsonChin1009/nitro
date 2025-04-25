import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const { category, amount, riskLevel, businessName, businessType } = await request.json();

  console.log("Received:", { category, amount, riskLevel, businessName, businessType });

  const API_KEY = process.env.GEMINI_API_KEY;
  console.log("✅ API Key Loaded in API Route:", API_KEY);

  if (!API_KEY) {
    return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Updated prompt: Instruct Gemini to output a single JSON object
  const prompt = `
You are a financial assistant helping to structure microloan repayments.

Given the following:
- Business Name: ${businessName}
- Business Type: ${businessType}
- Category: ${category}
- Loan Amount: ${amount}
- Risk Level: ${riskLevel}

🎯 Your task:
Generate a repayment plan with **between 1 and 5 total phases** (no less than 1, no more than 5).

Each phase should include:
- A short title (e.g., "Employee Payroll", "Equipment Purchase")
- A description (e.g., "Covers staff salary for 1 month")
- An objective (e.g., "Maintain team morale and service quality")
- A due day (number of days from today)
- An amount
- A list of **repayment strategy tips** (3–5 items)
- A list of **income-generation (earning) tips** (3–5 items)

🧾 Output format:
Return a **single clean JSON object**, no markdown, no explanations, just JSON.

{
  "riskLevel": "Low" | "Medium" | "High",
  "numberOfPhases": 3,
  "phaseTitles": ["Phase 1 Title", "Phase 2 Title", "Phase 3 Title"],
  "descriptions": ["Description 1", "Description 2", "Description 3"],
  "phaseObjectives": ["Objective 1", "Objective 2", "Objective 3"],
  "dueDays": [30, 60, 90],
  "amounts": [5000, 3000, 2000],
  "repaymentStrategies": [
    ["Tip A1", "Tip A2", "Tip A3"],
    ["Tip B1", "Tip B2", "Tip B3"],
    ["Tip C1", "Tip C2", "Tip C3"]
  ],
  "earningTips": [
    ["Income Tip A1", "Tip A2", "Tip A3"],
    ["Income Tip B1", "Tip B2", "Tip B3"],
    ["Income Tip C1", "Tip C2", "Tip C3"]
  ]
}
`
;

  console.log("✅ API Route hit!");

  try {
    const result = await model.generateContent(prompt);
    const apiResponse = await result.response;
    const text = apiResponse.text();

    console.log("🤖 Raw Gemini Output:", text);

    // Remove code fences (```json and ```), if present
    const cleanText = text
      .replace(/```json|```/g, "") // remove markdown code fences
      .replace(/,\s*([}\]])/g, "$1") // remove trailing commas before } or ]
      .trim();

    console.log("🧹 Cleaned Gemini Output:", cleanText);

    const parsed = JSON.parse(cleanText);

    return NextResponse.json({ strategy: parsed });
  } catch (error) {
    console.error("🔥 Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate strategy", details: String(error) },
      { status: 500 }
    );
  }
}
