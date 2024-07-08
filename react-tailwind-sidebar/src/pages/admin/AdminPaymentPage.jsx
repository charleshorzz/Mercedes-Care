import React from "react";
import PaymentKanban from "../../components/PaymentKanban";

const AdminPaymentPage = () => {
  return (
    <div className="p-8 font-alata">
      <div className="flex items-center justify-between p-4">
        <div className="text-xl font-bold">Payments</div>
      </div>
      <div className="w-full h-[36rem] overflow-auto scrollbar-hide scroll-smooth">
        <PaymentKanban />
      </div>
    </div>
  );
};

export default AdminPaymentPage;
