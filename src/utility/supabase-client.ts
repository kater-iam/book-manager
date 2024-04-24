import { createClient } from "@refinedev/supabase";

const SUPABASE_URL = "https://rketssdpmjzyfglufthh.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZXRzc2RwbWp6eWZnbHVmdGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM5NjUyODUsImV4cCI6MjAyOTU0MTI4NX0.1FxBn7pBHmxmIgU_jTPzqcEvHfRkszuLajuJErJ6xd4";


export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});