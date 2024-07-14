import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
    "https://tgmjpkbfqudgplcagtwo.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbWpwa2JmcXVkZ3BsY2FndHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3ODk4MzksImV4cCI6MjAzNjM2NTgzOX0.o_Mu8WSTjNmSDPzdK5xMITytbD9PkoNOHq5-2FlRL8g",
)