import { supabase } from "@/supabaseClient";
import { useRouter } from "expo-router";
import { useEffect } from "react";


interface Props {
  currentUserId: string;
}

export default function NotificationListener({ currentUserId }: Props) {
  const router = useRouter();
  console.log("NotificationListener mounted for user:", currentUserId);


  return null; // No UI
}
