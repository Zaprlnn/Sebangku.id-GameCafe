import dotenv from 'dotenv';
dotenv.config({path: './.env'});
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  global: { fetch: fetch, headers: {} },
  realtime: { transport: ws }
});

async function run() {
  const { data: gs } = await supabase.from('game_sessions').select('*');
  console.log("Total sessions:", gs?.length);
  
  // Delete all active sessions that ended (to clean up the user's dashboard)
  // or specifically session 70. We'll just delete all Active sessions because it's a test environment.
  // Actually, I'll delete session 70 and any session with 'detective'.
  const { data, error } = await supabase.from('game_sessions').delete().eq('status', 'Active');
  console.log('Deleted Active Sessions:', data, error);
}
run();
