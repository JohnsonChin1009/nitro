// lib/gemini.ts
// lib/gemini.ts
export async function generateRepaymentStrategies(
  riskLevel: "Low" | "Medium" | "High",
  businessName: string,
  businessType: string
) {
  console.log("📩 Sending request to /api/generate-strategy with:", {
    category: "business",
    amount: 15000,
    riskLevel,
    businessName,
    businessType,
  });

  try {
    const response = await fetch("/api/generate-strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "business",
        amount: 15000,
        riskLevel,
        businessName,
        businessType,
      }),
    });

    const data = await response.json();
    console.log("📬 Response from Gemini endpoint:", data);

    if (!response.ok) {
      console.error("❌ Gemini API returned error:", data.error);
      throw new Error(data.error || "Unknown error");
    }

    return data.strategy;
  } catch (error) {
    console.error("🔥 Error fetching repayment strategies:", error);
    return null;
  }
}


export async function generateInterestRateAnalysis() {
  try {
    console.log("🔄 Fetching Federal Funds Rate...");
    const fedRateResponse = await fetch(
      `https://www.alphavantage.co/query?function=FEDERAL_FUNDS_RATE&interval=daily&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
    );
    const fedRateData = await fedRateResponse.json();
    console.log("📊 Raw Federal Funds Rate Data:", JSON.stringify(fedRateData, null, 2));

    console.log("🔄 Fetching Treasury Yield...");
    const treasuryResponse = await fetch(
      `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
    );
    const treasuryData = await treasuryResponse.json();
    console.log("📊 Raw Treasury Yield Data:", JSON.stringify(treasuryData, null, 2));

    // Helper: calculate monthly average
    const calculateMonthlyAverage = (data: any[]) => {
      const monthlySums: Record<string, { sum: number; count: number }> = {};

      data.forEach((item: any) => {
        const date = new Date(item.date);
        const month = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        const value = parseFloat(item.value);

        if (!isNaN(value)) {
          if (!monthlySums[month]) {
            monthlySums[month] = { sum: 0, count: 0 };
          }
          monthlySums[month].sum += value;
          monthlySums[month].count += 1;
        }
      });

      return Object.entries(monthlySums)
        .map(([month, { sum, count }]) => ({
          month,
          rate: parseFloat((sum / count).toFixed(2)),
        }))
        .sort((a, b) => new Date(`1 ${a.month}`) > new Date(`1 ${b.month}`) ? -1 : 1) // sort by date desc
        .slice(0, 6) // last 6 months
        .reverse(); // oldest to newest
    };

    const formattedMarketTrends = {
      fedRate: calculateMonthlyAverage(fedRateData.data || []),
      treasuryYield: calculateMonthlyAverage(treasuryData.data || []),
    };

    console.log("✨ Formatted Market Trends:", JSON.stringify(formattedMarketTrends, null, 2));

    const response = await fetch("/api/interest-rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentRate: 5.25,
        riskLevel: "Medium",
        marketData: formattedMarketTrends,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate interest rate analysis");
    }

    const data = await response.json();
    console.log("📬 Response from Interest Rate API:", data);

    return {
      ...data.analysis,
      marketTrends: formattedMarketTrends,
    };
  } catch (error) {
    console.error("🔥 Error in generateInterestRateAnalysis:", error);
    return null;
  }
}

