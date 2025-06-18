interface RemoteConfig {
  app_description: string | null;
  app_url: string | null;
  email_whitelist_suffix: 0 | string[];
  is_email_verify: 0 | 1;
  is_invite_force: 0 | 1;
  is_recaptcha: 0 | 1;
  logo: string | null;
  recaptcha_site_key: string | null;
  tos_url: string | null;
}
interface UserInfo {
  avatar_url: string | null;
  balance: number;
  banned: 0 | 1;
  commission_balance: number;
  commission_rate: number | null;
  created_at: number;
  discount: number | null;
  email: string;
  expired_at: number | null;
  last_login_at: number | null;
  plan_id: number | null;
  remind_expire: 0 | 1;
  remind_traffic: 0 | 1;
  auto_renewal: 0 | 1;
  telegram_id: number | null;
  transfer_enable: number | null;
  uuid: string;
}
interface AppConfig {
  is_telegram: 0 | 1;
  telegram_discuss_link: string | null;
  stripe_pk: string | null;
  withdraw_methods: string[];
  withdraw_close: 0 | 1;
  currency: string;
  currency_symbol: string;
  commission_distribution_enable: 0 | 1;
  commission_distribution_l1: number | null;
  commission_distribution_l2: number | null;
  commission_distribution_l3: number | null;
}
interface NoticeData {
  content: string;
  id: number;
  img_url: string | null;
  show: 0 | 1;
  tags: string[] | null;
  title: string;
  created_at: number;
  updated_at: number;
  windows_type: number;
}
interface SubscribeData {
  plan_id: number;
  token: string;
  expired_at: number | null;
  u: number;
  d: number;
  transfer_enable: number;
  email: string;
  uuid: string;
  plan: PlanData | null;
  subscribe_url: string;
  reset_day: number | null;
  alive_ip?: number | null;
  device_limit?: number | null;
}
interface PlanData {
  id: number;
  group_id: number;
  name: string;
  content: string;
  transfer_enable: number;

  renew: 0 | 1;
  show: 0 | 1;

  sort: string | null;
  reset_traffic_method: number | null;
  capacity_limit: number | null;
  speed_limit: number | null;
  device_limit: number | null;

  month_price: number | null;
  quarter_price: number | null;
  half_year_price: number | null;
  year_price: number | null;
  two_year_price: number | null;
  three_year_price: number | null;
  onetime_price: number | null;
  reset_price: number | null;

  created_at: number;
  updated_at: number;
}
interface NodeData {
  id: number;
  show: 0 | 1;
  is_online: 0 | 1;
  name: string;
  type: string;
  rate: string;
  host: string | null;
  port: number;
  server_port: number;
  tags: string[] | null;

  group_id: string[];
  parent_id: number | null;
  route_id: number | null;

  cache_key: string | null;
  cipher: string | null;
  obfs: string | null;
  obfs_settings: string | null;

  sort: number;
  last_check_at: number | null;
  created_at: number;
  updated_at: number;
}
interface OrderData {
  actual_commission_balance: number | null;
  balance_amount: number | null;
  callback_no: string | null;
  commission_balance: number | null;
  commission_status: 0 | 1;
  coupon_id: number | null;
  created_at: number;
  discount_amount: number | null;
  handling_amount: number | null;
  invite_user_id: number | null;
  paid_at: number | null;
  payment_id: number | null;
  period: string;
  plan: PlanData;
  plan_id: number;
  refund_amount: number | null;
  status: number;
  surplus_amount: number | null;
  surplus_order_ids: number[] | null;
  total_amount: number | null;
  trade_no: string;
  type: number;
  updated_at: number;
  bounus: number | null;
  get_amount: number | null;
}
interface PaymentData {
  id: number;
  name: string;
  icon: string | null;
  payment: string;
  handling_fee_fixed: string | number | null;
  handling_fee_percent: string | number | null;
}
interface InviteCodeData {
  id: number;
  code: string;
  user_id: number;
  pv: number;
  status: number;
  created_at: number;
  updated_at: number;
}
interface InviteData {
  codes: InviteCodeData[];
  stat: number[];
}
interface TicketData {
  id: number;
  user_id: number;
  subject: string;
  level: number;
  status: number;
  reply_status: number;
  created_at: number;
  updated_at: number;
  message?: TicketMessageData[];
}
interface TicketMessageData {
  id: number;
  is_me: boolean;
  message: string;
  ticket_id: number;
  user_id: number;
  created_at: number;
  updated_at: number;
}
interface KnowledgeCategoryData {
  [key: string]: KnowledgeData[];
}
interface KnowledgeData {
  id: number;
  title: string;
  category: string;
  updated_at: number;
}
interface KnowledgeDetailData {
  id: number;
  title: string;
  body: string;
  show: 0 | 1;
  sort: number | null;
  language: string;
  category: string;
  created_at: number;
  updated_at: number;
}
interface CouponData {
  code: string;
  created_at: number;
  ended_at: number;
  id: number;
  limit_period: string[] | null;
  limit_plan_ids: string[] | null;
  limit_use: number | null;
  limit_use_with_user: number | null;
  name: string;
  show: 0 | 1;
  started_at: number;
  type: number;
  updated_at: number;
  value: number;
}
interface CommissionItemData {
  id: number;
  get_amount: number;
  order_amount: number;
  order_id: string;
  created_at: number;
}
interface ActiveSessionData {
  auth_data: string;
  ip: string;
  login_at: number;
  ua: string;
  key: string;
  index: number;
}
interface TrafficData {
  u: number;
  d: number;
  record_at: number;
  user_id: number;
  server_rate: string;
}
interface PopMessageData {
  id: number;
  title: string;
  content: string;
  tags: string[] | null;
  show: 0 | 1;
  created_at: number;
  updated_at: number;
  windows_type: number;
}
interface AppleData {
  id: number;
  username: string;
  password: string;
  frontend_remark: string;
  message: string;
  last_check: string;
  last_check_success: number;
  check_interval: number;
  region_display: string;
  status: boolean;
}
