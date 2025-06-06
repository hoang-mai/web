import { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import { Fab } from "@mui/material";
import ChatWindow from "./ChatWindow";

const ChatButton = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false);

  if (!userId) return null;

  return (
    <>
      <Fab
        sx={{
          bgcolor: "#fec34c",
          color: "#fff",
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
        onClick={() => setOpen(open? false : true)}
      >
        <ChatIcon />
      </Fab>

      {open && <ChatWindow userId={userId} onClose={() => setOpen(false)} />}
    </>
  );
};

export default ChatButton;
