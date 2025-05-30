import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { get, post } from "@/services/callApi";
import { fetchMessages } from "../fetchMessages";

const socket: Socket = io("http://localhost:8080", {
  autoConnect: true,
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };
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
        setMessages(loadedMessages);

        socket.on("message", handleMessage);
        return () => {
          socket.off("message", handleMessage);
          socket.disconnect();
        };
      } catch (err) {
        console.error("Lỗi khi tải tin nhắn", err);
      }
    };

    initChat();

    return () => {
      socket.off("message");
      socket.disconnect();
    };
  }, [userId]);

  const handleSend = async () => {
    if (!input.trim() || !chatBoxId) return;

    const messagePayload = {
      chatBoxId: chatBoxId,
      senderId: userId,
      content: input.trim(),
    };

    try {
      socket.emit("message", messagePayload);
      setMessages((prev) => [
        ...prev,
        {
          ...messagePayload,
          senderId: userId,
        },
      ]);
      setInput("");
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        right: 24,
        width: 300,
        height: 400,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: "8px",
          backgroundColor: "#007bff",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Hỗ trợ khách hàng</span>
        <button
          onClick={onClose}
          style={{ background: "none", color: "white", border: "none" }}
        >
          ×
        </button>
      </div>

      <div style={{ flex: 1, padding: "8px", overflowY: "auto" }}>
        {messages
          .filter((msg) => msg.content && typeof msg.content === "string")
          .map((msg, idx) => (
            <div
              key={idx}
              style={{ textAlign: msg.senderId === userId ? "right" : "left" }}
            >
              <div
                style={{
                  backgroundColor:
                    msg.senderId === userId ? "#e1f5fe" : "#fce4ec",
                  padding: "6px 10px",
                  margin: "4px 0",
                  borderRadius: 6,
                  display: "inline-block",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", padding: 8 }}>
        <input
          style={{ flex: 1, marginRight: 4 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Gửi</button>
      </div>
    </div>
  );
};

export default ChatWindow;
