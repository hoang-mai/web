import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { post } from "./services/callApi";
import { pushNotificationToAdminRoute } from "./services/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OrderSuccess: React.FC = () => {
  const query = useQuery();

  const amount = query.get("vnp_Amount");
  const bankCode = query.get("vnp_BankCode");
  const bankTranNo = query.get("vnp_BankTranNo");
  const cardType = query.get("vnp_CardType");
  const orderInfo = query.get("vnp_OrderInfo");
  const payDate = query.get("vnp_PayDate");
  const transactionNo = query.get("vnp_TransactionNo");
  const transactionStatus = query.get("vnp_TransactionStatus");

  // Format amount to VND
  const formatAmount = (amt: string | null) => {
    if (!amt) return "";
    return Number(amt) / 100 + " ₫";
  };

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr || dateStr.length !== 14) return dateStr;
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const hour = dateStr.slice(8, 10);
    const min = dateStr.slice(10, 12);
    const sec = dateStr.slice(12, 14);
    return `${hour}:${min}:${sec} ${day}/${month}/${year} `;
  };
  useEffect(() => {
    post(pushNotificationToAdminRoute, {
      title: "Đặt hàng thành công",
      body: `Đơn hàng mới từ khách hàng. Số tiền: ${formatAmount(amount)}`
    }).then(() => {
      console.log("Thông báo đã được gửi đến quản trị viên");
    }).catch((error) => {
      console.error("Lỗi khi gửi thông báo:", error);
    });
  }, []);
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Đặt hàng thành công!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Cảm ơn bạn đã mua hàng. Dưới đây là thông tin đơn hàng của bạn:
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ display: 'flex', flexWrap: 'wrap', p: 0 }}>
          <Box sx={{ width: '50%' }}>
            <ListItem>
              <ListItemText primary="Số tiền" secondary={formatAmount(amount)} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ngân hàng" secondary={bankCode} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mã giao dịch ngân hàng" secondary={bankTranNo} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Loại thẻ" secondary={cardType} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Thông tin đơn hàng" secondary={orderInfo} />
            </ListItem>
          </Box>
          <Box sx={{ width: '50%' }}>
            <ListItem>
              <ListItemText primary="Ngày thanh toán" secondary={formatDate(payDate)} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mã giao dịch VNPAY" secondary={transactionNo} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Trạng thái giao dịch" secondary={transactionStatus === "00" ? "Thành công" : transactionStatus} />
            </ListItem>
          </Box>
        </List>
      </Paper>
    </Container>
  );
};

export default OrderSuccess;