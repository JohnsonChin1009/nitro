import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface User {
    wallet_address: string; // Primary key
    username: string;
    created_at: string;
    avatar_url: string;
  }
  
export interface Pool {
  id: string; // UUID
  pool_name: string;
  created_by: string;
  created_at: string;
}
  
export interface ChatRoom {
  id: string; // UUID
  pool_id: string; // Reference to the pool (UUID)
  created_by: string; // wallet_address of the user who created the chat room
  created_at: string; // Timestamp when the chat room was created
}
  
export interface Message {
  id: number; // UUID
  chatroomid: string; // Reference to the chat room
  userid: string; // wallet_address of the user who sent the message
  content: string; // The message content
  created_at: string; // Timestamp when the message was sent
  updated_at: string; // Timestamp when the message was updated
}

export interface PoolInfo {
  poolAddress: string;
  poolDescription: string;
  poolTokenAddress: string;
  poolInterestRate: number;
  poolQuorum: number;
  poolExpiration: Timestamp;
  poolminBalance: number;
  poolinitialStake: number;
}

export interface UserCreditProfile {
  creditScore: number;
  reputationScore: number;
  lastActivity: number; // UNIX timestamp
  totalTransactions: number;
  isActive: boolean;
}