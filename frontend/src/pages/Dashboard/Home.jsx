import React, { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosintance";
import { APIpaths } from "../../utils/apiPath";
import { useUserAuth } from "../../hooks/useUserAuth";
import InfoCard from "../../components/InfoCard";
import { LuWalletMinimal } from "react-icons/lu"; // Example icon
import RecentTransctions from "../../components/RecentTransctions";
import FinanceOverview from '../../components/FinanceOverview'

function addThousandSeperate(value) {
  if (!value) return "0";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Home() {
  useUserAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchingData = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(APIpaths.DASHBOARD.GETDATA);
        if (response.data) {
          setDashboardData(response.data);
          // console.log(response.data);
        }
      } catch (error) {
        console.log("Something went wrong. Please try again later.");
        if (error?.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchingData();
  }, [loading, navigate]);

  return (
    <div className="px-4 md:px-8 py-6">
      <Dashboard activeMenu="Dashboard">
        <div className="my-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<LuWalletMinimal />}
              label="Total Balance"
              value={addThousandSeperate(dashboardData?.totalBalance)}
              color="bg-green-500"
            />
            <InfoCard
              icon={<LuWalletMinimal />}
              label="Total Income"
              value={addThousandSeperate(dashboardData?.totalIncome)}
              color="bg-orange-500"
            />
            <InfoCard
              icon={<LuWalletMinimal />}
              label="Total Expense"
              value={addThousandSeperate(dashboardData?.totalExpense)}
              color="bg-red-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <RecentTransctions
              transactions={dashboardData?.RecentTransctions}
              onSeeMore={() => navigate("/expense")}
            />
            <FinanceOverview totalBalance={dashboardData?.totalBalance || 0} totalIncome={dashboardData?.totalIncome || 0} totalExpense={dashboardData?.totalExpense}/>
          </div>
        </div>
      </Dashboard>
    </div>
  );
}

export default Home;
