import { useEffect } from "react";
import { supabase } from "@/supabaseClient";
import * as Notifications from "expo-notifications";


interface Props {
  currentUserId: string;
}

async function sendInAppNotifications(payload: any) {
    try {
    // payload expected to contain title/body/data fields (adjust to your DB shape)
    const title = payload.title ?? payload.subject ?? "Notification";
    const body = payload.body ?? payload.message ?? "User match!";
    const data = payload.data ?? {};

    // Schedule immediate local notification (trigger: null)
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: null,
    });
  } catch (err) {
    console.warn("sendInAppNotifications failed", err);
  }
}
export default function NotificationListener({ currentUserId }: Props) {
    

  useEffect(() => {
    if (!currentUserId) return;

    // Ensure notifications are displayed while app is foregrounded
    useEffect(() => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}, []);

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload) => {
          console.log("New notification:", payload.new);
          sendInAppNotifications(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return null; // No UI
}
