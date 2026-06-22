import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import EmptyState from "../components/ui/EmptyState";
import { getSummary } from "../services/dashboard";
import CategoryPie from "../components/charts/CategoryPie";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function StatCard({ label, value, color }) {
  const colors = {
    green:  "bg-green-50 border-green-200",
    red:    "bg-red-50 border-red-200",
    blue:   "bg-blue-50 border-blue-200",
    orange: "bg-orange-50 border-orange-200",
  };
  const text = {
    green:  "text-green-700",
    red:    "text-red-700",
    blue:   "text-blue-700",
    orange: "text-orange-700",
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${text[color]} opacity-80`}>{label}</p>
      <p className={`text-2xl font-bold mt-1 ${text[color]}`}>{Number(value).toLocaleString()}</p>
    </div>
  );
}

export default function Dashboard() {
  const [month, setMonth]     = useState(currentMonth());
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await getSummary(month);
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [month]);

  const byCategory = useMemo(() => data?.byCategory || [], [data]);
  const savingsRate = data?.totalIncome > 0
    ? Math.max(0, Math.round((data.balance / data.totalIncome) * 100))
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Financial overview for the selected month</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Month</label>
            <input
              type="month"
              className="input w-40"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
        </div>

        {err && <Alert>{err}</Alert>}

        {loading ? (
          <Spinner />
        ) : data ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total Income"   value={data.totalIncome}   color="green" />
              <StatCard label="Total Expenses" value={data.totalExpenses} color="red" />
              <StatCard
                label={data.balance >= 0 ? "Balance" : "Deficit"}
                value={data.balance}
                color={data.balance >= 0 ? "blue" : "orange"}
              />
            </div>

            {/* Savings rate */}
            {data.totalIncome > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Savings rate</p>
                  <span className="text-sm font-bold text-primary-600">{savingsRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary-500 transition-all"
                    style={{ width: `${Math.min(savingsRate, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Chart + table side by side on wide screens */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Spending by category</h2>
                {byCategory.length === 0 ? (
                  <EmptyState
                    title="No expense data"
                    message="Add expenses to see a category breakdown."
                  />
                ) : (
                  <div className="flex justify-center">
                    <div className="w-full max-w-xs">
                      <CategoryPie items={byCategory} />
                    </div>
                  </div>
                )}
              </div>

              {byCategory.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-900">Category breakdown</h2>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Category</th>
                        <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Amount</th>
                        <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {byCategory.map((c) => (
                        <tr key={c.category} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium text-gray-900">{c.category}</td>
                          <td className="px-6 py-3 text-right text-gray-700">{c.total.toLocaleString()}</td>
                          <td className="px-6 py-3 text-right text-gray-500">
                            {data.totalExpenses > 0
                              ? `${Math.round((c.total / data.totalExpenses) * 100)}%`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </Layout>
  );
}
