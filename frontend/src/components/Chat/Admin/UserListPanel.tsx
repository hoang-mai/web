import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const UserListPanel = ({ userList, selected, onSelect }) => {
  return (
    <Box width="25%" borderRight="1px solid #ddd" overflow="auto">
      <Box p={2} fontWeight="bold">
        Người dùng
      </Box>
      <List>
        {userList.length === 0 && (
          <Box px={2} py={1} color="gray">
            Chưa có người dùng nào nhắn tin.
          </Box>
        )}
        {userList.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selected === item.id}
              onClick={() => onSelect(item)}
              sx={{
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                "&.Mui-selected": {
                  bgcolor: "#ffe169",
                  color: "#1c1c1c",
                },
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "#fad643",
                },
              }}
            >
              <ListItemText
                primary={item.user?.userName || "Không rõ tên"}
                secondary={item.user?.email || ""}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserListPanel;
