import { Box, TextField, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getUserIdFromToken } from "@/services/getUserId";
import { fetchMessages } from "../fetchMessages";

const socket: Socket = io("http://localhost:8080", {
  autoConnect: false,
  transports: ["websocket"],
});

const ChatBoxPanel = ({ chatBox }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const adminId = getUserIdFromToken();

  // Scroll xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Khởi tạo socket và fetch tin nhắn khi chọn chatBox mới
  useEffect(() => {
    if (!chatBox || !adminId) return;

    const initSocket = async () => {
      try {
        if (!socket.connected) {
          socket.io.opts.query = { userId: adminId, role: "admin" };
          socket.connect();
        }

        socket.emit("register", { userId: adminId, role: "admin" });
        socket.emit("join", { chatBoxId: chatBox.id });

        const loadedMessages = await fetchMessages(chatBox.id);
        const normalized = loadedMessages.map((msg) => ({
          ...msg,
          senderId: msg.sender?.id || msg.senderId,
        }));
        setMessages(normalized);
      } catch (err) {
        console.error("Lỗi khi khởi tạo tin nhắn:", err);
      }
    };

    initSocket();
  }, [chatBox, adminId]);

  // Nghe tin nhắn realtime từ socket
  useEffect(() => {
    const handleMessage = (msg: any) => {
      if (msg.chatBoxId === chatBox?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, [chatBox]);

  const handleSend = () => {
    if (!input.trim() || !chatBox?.id) return;

    const messagePayload = {
      chatBoxId: chatBox.id,
      senderId: adminId,
      content: input.trim(),
    };

    try {
      socket.emit("message", messagePayload);
      setInput("");
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

  if (!chatBox) {
    return (
      <Box
        width="75%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Chọn người dùng để bắt đầu
      </Box>
    );
  }

  return (
    <Box
      width="75%"
      display="flex"
      flexDirection="column"
      borderLeft="1px solid #eee"
    >
      <Box p={2} flex={1} overflow="auto">
        {messages
          .filter((msg) => msg.content && typeof msg.content === "string")
          .map((msg, i) => (
            <Box
              key={i}
              textAlign={msg.senderId === adminId ? "right" : "left"}
              mb={1}
            >
              <Box
                bgcolor={msg.senderId === adminId ? "#e1f5fe" : "#fce4ec"}
                display="inline-block"
                px={2}
                py={1}
                borderRadius={2}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        <div ref={scrollRef} />
      </Box>

      <Box p={2} display="flex" gap={1}>
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

export default ChatBoxPanel;
