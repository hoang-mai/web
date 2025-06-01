import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { get } from "@/services/callApi";
import UserListPanel from "@/components/Chat/Admin/UserListPanel";
import ChatBoxPanel from "@/components/Chat/Admin/ChatBoxPanel";

const AdminChatPage = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [selectedChatBox, setSelectedChatBox] = useState<any>(null);

  useEffect(() => {
    const fetchUserChatBoxes = async () => {
      const res = await get("/chat/list-user-chat-boxes");
      setUserList(res.data);
    };

    fetchUserChatBoxes();
  }, []);

  return (
    <Box display="flex" height="calc(100vh - 64px)">
      {" "}
      {/* trừ header nếu có */}
      <UserListPanel
        userList={userList}
        selected={selectedChatBox?.id}
        onSelect={(chatBox) => setSelectedChatBox(chatBox)}
      />
      <ChatBoxPanel chatBox={selectedChatBox} />
    </Box>
  );
};

export default AdminChatPage;
