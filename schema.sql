-- Run this in your Supabase SQL Editor

-- 1. Create Workspaces table
CREATE TABLE workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Chats table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Messages table (stores the conversation history for a chat)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats ON DELETE CASCADE NOT NULL,
  oracle_id TEXT NOT NULL, -- 'openai', 'anthropic', etc. or 'user'
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS (Row Level Security)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create Policies to ensure users can only see their own data
CREATE POLICY "Users can view own workspaces" ON workspaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workspaces" ON workspaces FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own chats" ON chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chats" ON chats FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages of their chats" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid())
);
CREATE POLICY "Users can insert messages to their chats" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid())
);
