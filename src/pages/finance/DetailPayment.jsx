import React from "react";
import { useLocation } from "react-router-dom";

import DetailPayment from "../../components/detail-payment";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const DetailPaymentPage = () => {
  const query = useQuery();
  const typeOrder = query.get("orderType");
  return (
    <div className="p-6">
      <DetailPayment typeOrder={typeOrder} />
    </div>
  );
};

export default DetailPaymentPage;
