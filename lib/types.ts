export interface User {
    wallet_address: string; // Primary key
    username: string;
    created_at: string;
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
  