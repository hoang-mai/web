// Đăng ký nhận thông báo từ server
export const pushNotificationSubscribe = 'push-notification/subscribe';
export const pushNotificationNotify = 'push-notification/notify';

//auth
export const loginRoute = '/auth/login';
export const registerRoute = '/auth/register';
export const checkTokenRoute = '/auth/check-token'; 
export const refreshTokenRoute = '/auth/refresh-token';


//user
export const findUserByIdRoute = '/users/:id';
export const updateUserRoute = '/users/:id';

//orders
export const findOrdersRoute = '/orders/filter';
export const updateOrderRoute = '/orders/update/:id';


//admin

//product
export const productAdmin='/products/admin';
export const productStatistic='/products/admin/statistic';

// statistics
export const statisticRevenue='statistics/admin/revenue';
export const statisticProductDetail='statistics/admin/product';
export const statisticRevenueProduct='statistics/admin/revenue/product';

// user
export const getUserRoute='/users';
export const getOrderRoute='/orders/all/:userId';

export const getAllOrderRoute='/orders';
