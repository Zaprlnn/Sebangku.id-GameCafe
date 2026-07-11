import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import WebSocket from 'ws';
global.WebSocket = WebSocket;

const envConfig = fs.readFileSync('.env', 'utf-8')
  .split('\n')
  .reduce((acc, line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      acc[match[1].trim()] = match[2].trim();
    }
    return acc;
  }, {});

const supabaseUrl = envConfig['VITE_SUPABASE_URL'];
const supabaseKey = envConfig['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Deleting old tables...");
  await supabase.from('cafe_tables').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
  
  const tables = [
    { name: "Meja 1", capacity: 4, location: "Available", status: "Available" },
    { name: "Meja 2", capacity: 4, location: "Available", status: "Available" },
    { name: "Meja 3", capacity: 4, location: "Available", status: "Available" },
    { name: "Meja 4", capacity: 4, location: "Available", status: "Available" },
    { name: "Meja 5", capacity: 4, location: "Available", status: "Available" },
    { name: "Meja 6", capacity: 4, location: "Available", status: "Available" }
  ];

  console.log("Inserting new tables...");
  const { data, error } = await supabase.from('cafe_tables').insert(tables);
  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Done inserting!");
  }
}

seed();
