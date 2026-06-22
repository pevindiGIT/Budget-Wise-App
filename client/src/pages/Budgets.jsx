import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import EmptyState from "../components/ui/EmptyState";
import { CATEGORIES } from "../services/categories";
import { deleteBudget, getBudgets, getBudgetUsage, upsertBudget } from "../services/budgets";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function Budgets() {
  const [month, setMonth]     = useState(currentMonth());
  const [budgets, setBudgets] = useState([]);
  const [usage, setUsage]     = useState([]);
  const [err, setErr]         = useState("");
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ category: "Food", monthlyLimit: "" });

  async function load() {
    setErr("");
    try {
      const [bRes, uRes] = await Promise.all([getBudgets({ month }), getBudgetUsage(month)]);
      setBudgets(bRes.data);
      setUsage(uRes.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load budgets.");
    }
  }

  useEffect(() => { load(); }, [month]); // eslint-disable-line

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await upsertBudget({ month, category: form.category, monthlyLimit: Number(form.monthlyLimit) });
      setForm({ category: "Food", monthlyLimit: "" });
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await deleteBudget(id);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Planning</h1>
            <p className="text-sm text-gray-500 mt-0.5">Set and monitor your spending limits</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Month</label>
            <input type="month" className="input w-36" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
        </div>

        {err && <Alert>{err}</Alert>}

        {/* Set Budget form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Set budget limit</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Select label="Category" value={form.category} onChange={f("category")}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Input label="Monthly limit" type="number" step="0.01" min="0.01" placeholder="0.00" value={form.monthlyLimit} onChange={f("monthlyLimit")} required />
              <div className="flex items-end">
                <Button type="submit" loading={saving} className="w-full justify-center">Save budget</Button>
              </div>
            </div>
          </form>
        </div>

        {/* Budgets list + Usage side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Budget list */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Your budgets</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {budgets.map((b) => (
                <div key={b._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-900">{b.category}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Limit: {b.monthlyLimit.toLocaleString()}</p>
                  </div>
                  <button onClick={() => remove(b._id)} className="text-xs font-medium text-red-500 hover:text-red-700">Delete</button>
                </div>
              ))}
            </div>
            {budgets.length === 0 && (
              <EmptyState title="No budgets set" message="Set your first budget limit above." />
            )}
          </div>

          {/* Usage */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Budget usage</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {usage.map((u) => {
                const over = u.percent >= 100;
                const warn = u.percent >= 80 && u.percent < 100;
                const barColor = over ? "bg-red-500" : warn ? "bg-orange-400" : "bg-primary-500";
                const pctColor = over ? "text-red-600" : warn ? "text-orange-600" : "text-green-700";

                return (
                  <div key={u._id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{u.category}</span>
                      <span className={`text-xs font-bold ${pctColor}`}>{u.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                      <div
                        className={`h-2 rounded-full transition-all ${barColor}`}
                        style={{ width: `${Math.min(u.percent, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{u.totalSpent.toLocaleString()} / {u.monthlyLimit.toLocaleString()} spent</span>
                      <span>{u.remaining > 0 ? `${u.remaining.toLocaleString()} left` : "Over budget"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {usage.length === 0 && (
              <EmptyState title="No usage data" message="Set budgets and add expenses to see tracking." />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
