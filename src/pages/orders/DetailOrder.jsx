import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import DetailOrder from "../../components/detail-order";
import useFetch from "../../hooks/useFetch";
import { fetchOrderDetail } from "../../api";
import TableSkeleton from "../../components/loader/table-skeleton";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const DetailOrderPage = () => {
  const query = useQuery();
  const typeOrder = query.get("typeOrder");

  const { id } = useParams();

  // Fetch data dari API
  const { data, initialLoading, refetching, error } = useFetch(
    ["orderDetail"],
    () => fetchOrderDetail(id),
    { keepPreviousData: true }
  );

  if (initialLoading) {
    return (
      <div className="p-10">
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <DetailOrder data={data.data} />
    </div>
  );
};

export default DetailOrderPage;
