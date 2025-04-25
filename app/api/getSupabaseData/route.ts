import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const supabase = await createClient();

    const walletAddress = body.walletAddress;

    if (!walletAddress) {
        return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }
    
    try {
        const { data: userData, error: userError } = await supabase.from("users").select("*").eq("wallet_address", walletAddress).single();

        if (userError || !userData) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            status: 200,
            data: {userData}
        });
    } catch (error: unknown) {
        console.error("Error fetching user data from Supabase:", error);
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}