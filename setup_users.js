import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

globalThis.WebSocket = WebSocket;

const supabaseUrl = 'https://uetbkbvwthbqpedxscom.supabase.co';
const supabaseAnonKey = 'sb_publishable_hzK7fVNG4NCCF7q37LZGJg_tWpXngrM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupUsers() {
  console.log('Setting up default users...');

  // 1. Owner
  const { data: ownerData, error: ownerError } = await supabase.auth.signUp({
    email: 'owner@sebangku.id',
    password: 'Owner@1234',
    options: {
      data: {
        name: 'Owner Boardverse',
        role: 'Owner'
      }
    }
  });

  if (ownerError) {
    console.error('Failed to create Owner:', ownerError.message);
  } else {
    console.log('✅ Owner created successfully');
  }

  // 2. Kasir
  const { data: kasirData, error: kasirError } = await supabase.auth.signUp({
    email: 'kasir@sebangku.id',
    password: 'Kasir@1234',
    options: {
      data: {
        name: 'Kasir Utama',
        role: 'Kasir'
      }
    }
  });

  if (kasirError) {
    console.error('Failed to create Kasir:', kasirError.message);
  } else {
    console.log('✅ Kasir created successfully');
  }
}

setupUsers();
