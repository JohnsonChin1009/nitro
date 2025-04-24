import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { message } = await req.json();

    const response = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "command", // Use Cohere's AI model
            prompt: message,
            max_tokens: 50
        }),
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json({ reply: data.generations?.[0]?.text || "No response generated." });
}