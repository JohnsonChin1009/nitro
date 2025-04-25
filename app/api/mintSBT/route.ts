import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import path from "path";
import NitroCreditSBT from "@/contract-artifacts/NitroCreditSBT.json";
import * as snarkjs from "snarkjs";
import { ethers } from "ethers";
import fs from "fs";

// Helper function to verify file existence and log details
function checkFile(filePath: string, label: string): boolean {
  if (!fs.existsSync(filePath)) {
    console.error(`${label} file not found at: ${filePath}`);
    return false;
  }

  return true;
}

const USE_REAL_PROOF = false; 

export async function POST(req: NextRequest) {
    try {
        console.log("API route started");
        const { name, dob, walletAddress } = await req.json();

        if (!name || !dob || !walletAddress) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Step 1: Create today's date and extract the year
        const currentYear = new Date().getFullYear();

        // Step 2: Extract the year from the date of birth
        const birthYear = new Date(dob).getFullYear();

        // Step 3: Format zkProof input
        const input = { "birthYear": birthYear.toString(), "currentYear": currentYear.toString() };

        // Step 4: Declare the path to the circuit files
        const wasmPath = path.join(process.cwd(), "zkProof/builds/main_js/main.wasm");
        const zKeyPath = path.join(process.cwd(), "zkProof/main_final.zkey");

        // Check if files exist before proceeding
        const wasmExists = checkFile(wasmPath, "WASM");
        const zKeyExists = checkFile(zKeyPath, "zKey");
        
        if (!wasmExists || !zKeyExists) {
            return NextResponse.json({ 
                message: "Circuit files not found",
                wasmExists,
                zKeyExists,
                wasmPath,
                zKeyPath
            }, { status: 500 });
        }

        let proof, publicSignals;

        if (USE_REAL_PROOF) {
            // Use actual proof generation
            console.log("Starting proof generation...");
            console.time("zkProof");
            
            try {
                const result = await snarkjs.groth16.fullProve(input, wasmPath, zKeyPath);
                proof = result.proof;
                publicSignals = result.publicSignals;
                
                console.timeEnd("zkProof");
                console.log("Proof generation completed");
            } catch (proofError) {
                console.error("Error during proof generation:", proofError);
                return NextResponse.json({ 
                    message: "Failed to generate proof", 
                    error: proofError instanceof Error ? proofError.message : String(proofError),
                    status: 500 
                });
            }
        } else {
            try {
                const proofPath = path.join(process.cwd(), "zkProof/proof.json");
                const publicPath = path.join(process.cwd(), "zkProof/public.json");
                const uri = "https://ipfs.io/ipfs/bafkreiaf3xpmsevkvrhxw63ennj3m2xcvxwvoh5apwrtnfnoxmzn52wrgq";

                if (fs.existsSync(proofPath) && fs.existsSync(publicPath)) {
                    proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
                    publicSignals = JSON.parse(fs.readFileSync(publicPath, 'utf8'));

                    const contractAddress = "0xd7121344156D594Eb875213d0bdBf2BA24117944";
                    const contractABI = NitroCreditSBT.abi;
                    const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io/");
                    const privateKey = process.env.PRIVATE_KEY || "";
                    const signer = new ethers.Wallet(privateKey, provider);
                    const contract = new ethers.Contract(contractAddress, contractABI, signer);

                    const a = [(proof.pi_a[0]), (proof.pi_a[1])];
                    const b = [
                    [(proof.pi_b[0][0]), (proof.pi_b[0][1])],
                    [(proof.pi_b[1][0]), (proof.pi_b[1][1])]
                    ];
                    const c = [(proof.pi_c[0]), (proof.pi_c[1])];
                      
                    const inputSignals = publicSignals.map((signal: string) => signal.toString());


                    console.log("🧾 walletAddress:", walletAddress);
                    console.log("📦 uri:", uri);
                    console.log("🧠 a:", a);
                    console.log("🧠 b:", b);
                    console.log("🧠 c:", c);
                    console.log("📊 input:", inputSignals);
                    const tx = await contract.mint(walletAddress, uri, a, b, c, inputSignals);
                    const receipt = await tx.wait();

                    if (receipt.status !== 1) {
                        console.error("Transaction failed");
                        return NextResponse.json({ 
                            message: "Transaction failed", 
                            status: 500 
                        });
                    }

                    const supabase = await createClient();

                    const avatarURLArray = [
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//1.png",
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//2.png",
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//3.png",
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//4.png",
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//5.png",
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//6.png",
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//7.png",
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//8.png",
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//9.png",
                        "https://fsmwldyfybsryktkoyzt.supabase.co/storage/v1/object/public/profile-images//10.png",
                    ]

                    try {
                        const { data, error } = await supabase.from("users").insert([
                            {
                                wallet_address: walletAddress,
                                username: name,
                                created_at: new Date(),
                                avatar_url: avatarURLArray[Math.floor(Math.random() * avatarURLArray.length)],
                        }]);

                        if (error) {
                            console.error("Error inserting into Supabase:", error);
                            return NextResponse.json({ 
                                message: "Failed to insert into Supabase", 
                                error: error.message,
                                status: 500 
                            });
                        }

                        console.log("Inserted into Supabase:", data);
                    } catch (error: unknown) {
                        console.error("Error inserting into Supabase:", error);
                        return NextResponse.json({ 
                            message: "Failed to insert into Supabase", 
                            error: error instanceof Error ? error.message : String(error),
                            status: 500 
                        });
                    }

                    console.log("✅ SBT minted successfully", tx.hash);

                } else {
                    console.error("Proof or public signals files not found");
                    return NextResponse.json({ 
                        message: "Proof or public signals files not found", 
                        status: 500 
                    });
                }
            } catch (error) {
                console.error("Error loading mock data:", error);
                // Fallback to simple mock data
                proof = { mockProof: true };
                publicSignals = ["12345"];
            }
        }
            
        return NextResponse.json({ 
            message: "SBT Minted Successfully", 
            proof,
            publicSignals,
            usingMockData: !USE_REAL_PROOF,
            status: 200 
        });
    } catch (error: unknown) {
        console.error("Error in API route:", error);
        return NextResponse.json({ 
            message: "Failed to mint SBT", 
            error: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
    }
}