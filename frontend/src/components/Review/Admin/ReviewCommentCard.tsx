import { Box, Typography, Avatar, Chip } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function ReviewCommentCard({ comment }: { comment: any }) {
  return (
    <Box
      sx={{
        bgcolor: '#f8f9fa',
        borderLeft: '4px solid #ffc107',
        borderRadius: 2,
        p: 2,
        pl: 3,
        ml: 4,
        mt: 2,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Avatar
          sx={{ bgcolor: '#ffc107', width: 28, height: 28, fontSize: 14 }}
        >
          A
        </Avatar>
        <Typography fontWeight="bold" fontSize={14}>
          {comment.adminName || 'Quản trị viên'}
        </Typography>
        <Chip
          label="Quản trị viên"
          color="warning"
          icon={<AdminPanelSettingsIcon fontSize="small" />}
          size="small"
          sx={{ ml: 1 }}
        />
      </Box>

      <Typography fontSize={14} mt={1}>
        {comment.content}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        mt={0.5}
        display="block"
      >
        {comment.createdAtRelative || 'Vừa xong'}
      </Typography>
    </Box>
  );
}
