import { Box, TextField, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { fetchMessages } from "../fetchMessages";
import { post } from "@/services/callApi";

const socket: Socket = io("http://localhost:8080", {
  autoConnect: false,
  transports: ["websocket"],
});

const ChatWindow = ({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) => {
  const [chatBoxId, setChatBoxId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Khởi tạo chat và kết nối socket
  useEffect(() => {
    if (!userId) return;

    const initChat = async () => {
      try {
        const res = await post("/chat/init", { userId });
        const id = res.data.chatBoxId;
        setChatBoxId(id);

        if (!socket.connected) {
          socket.io.opts.query = { userId, role: "user" };
          socket.connect();
        }

        socket.emit("register", { userId, role: "user" });
        socket.emit("join", { chatBoxId: id });

        const loadedMessages = await fetchMessages(id);
        const normalized = loadedMessages.map((msg) => ({
          ...msg,
          senderId: msg.sender?.id || msg.senderId,
        }));
        setMessages(normalized);
      } catch (err) {
        console.error("Lỗi khi khởi tạo chat:", err);
      }
    };

    initChat();
  }, [userId]);

  // Nghe tin nhắn realtime
  useEffect(() => {
    const handleMessage = (msg: any) => {
      if (msg.chatBoxId === chatBoxId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, [chatBoxId]);

  const handleSend = () => {
    if (!input.trim() || !chatBoxId) return;

    const messagePayload = {
      chatBoxId,
      senderId: userId,
      content: input.trim(),
    };

    try {
      socket.emit("message", messagePayload);
      setInput("");
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 80,
        right: 24,
        width: 300,
        height: 400,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1,
          bgcolor: "#007bff",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Hỗ trợ khách hàng</span>
        <Button onClick={onClose} sx={{ color: "white", minWidth: 0 }}>
          ×
        </Button>
      </Box>

      {/* Danh sách tin nhắn */}
      <Box sx={{ flex: 1, p: 1, overflowY: "auto" }}>
        {messages
          .filter((msg) => msg.content && typeof msg.content === "string")
          .map((msg, idx) => (
            <Box
              key={idx}
              textAlign={msg.senderId === userId ? "right" : "left"}
              mb={1}
            >
              <Box
                sx={{
                  bgcolor: msg.senderId === userId ? "#e1f5fe" : "#fce4ec",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  display: "inline-block",
                }}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        <div ref={scrollRef} />
      </Box>

      {/* Ô nhập và nút gửi */}
      <Box p={1} display="flex" gap={1}>
        <TextField
          fullWidth
          size="small"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Gửi
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;
