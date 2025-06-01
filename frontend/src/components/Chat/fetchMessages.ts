import { get } from "@/services/callApi";

export const fetchMessages = async (chatBoxId: string): Promise<any[]> => {
  try {
    const messagesRes = await get(`/chat/${chatBoxId}/messages`);
    const normalized = messagesRes.data.map((msg: any) => ({
      ...msg,
      senderId: msg.sender?.id || msg.senderId,
    }));
    return normalized;
  } catch (err) {
    console.error("Lỗi tải tin nhắn:", err);
    return [];
  }
};
