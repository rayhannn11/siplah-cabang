import axios from "../lib/axios";

export const fetchOrders = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  mall_id = "",
  // vaStatus = "",
}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);
  if (mall_id) params.append("mall_id", mall_id);

  // 🟢 Ubah format status
  if (status && Array.isArray(status) && status.length > 0) {
    // Gabungkan dengan koma tanpa encoding
    params.append("status", status.join(","));
  } else if (typeof status === "string" && status) {
    params.append("status", status);
  }

  // if (vaStatus) params.append("vaStatus", vaStatus);

  const queryString = params.toString().replaceAll("%2C", ","); // 🧩 pastikan koma tidak di-encode
  const res = await axios.get(`orders?${queryString}`);
  return res.data;
};

export const fetchOrderDetail = async (id) => {
  const res = await axios.get(`orders/${id}`);
  return res.data;
};

export const fetchOrdersStats = async () => {
  const res = await axios.get("orders/stats");
  return res.data;
};

export const fetchOrdersRekanan = async () => {
  const res = await axios.get("partners/selected");
  return res.data;
};

export const fetchOrdersUnconfirmed = async ({
  page = 1,
  limit = 10,
  search = "",
  // status = "",
  //   vaStatus = "",
}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);
  // if (status) params.append("status", status);
  //   if (vaStatus) params.append("vaStatus", vaStatus);

  const res = await axios.get(`orders/unconfirmed?${params.toString()}`);
  return res.data;
};

export const exportOrders = async ({
  search = "",
  status = "",
  startDate = "",
  endDate = "",
} = {}) => {
  // Siapkan body
  const body = {};

  if (search) body.search = search;
  if (status) body.status = status;
  if (startDate) body.startDate = startDate;
  if (endDate) body.endDate = endDate;

  // Jika semua kosong, tetap kirim {} (sesuai ketentuan)
  const res = await axios.post(
    "orders/export",
    Object.keys(body).length ? body : {}
  );

  return res.data;
};

export const exportOrdersStatus = async (id) => {
  const res = await axios.get(`orders/export/${id}`);
  return res.data;
};

export const fetchPayments = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  vaStatus = "",
}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (vaStatus) params.append("va_status", vaStatus);

  const res = await axios.get(`payments?${params.toString()}`);
  return res.data;
};

export const fetchPaymentsSummary = async () => {
  const res = await axios.get("payments/summary");
  return res.data;
};

export const fetchPartnersActive = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  status_approve = "",
}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (status_approve) params.append("status_approve", status_approve);

  const res = await axios.get(`partners/active?${params.toString()}`);
  return res.data;
};

export const fetchPartnersHistory = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  status_approve = "",
  year = "",
}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (status_approve) params.append("status_approve", status_approve);
  if (year) params.append("year", year);

  const res = await axios.get(`partners/history?${params.toString()}`);
  return res.data;
};

export const fetchPartnersInactive = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  status_approve = "",
}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (status_approve) params.append("status_approve", status_approve);

  const res = await axios.get(`partners/inactive?${params.toString()}`);
  return res.data;
};
