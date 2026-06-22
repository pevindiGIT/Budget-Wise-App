import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import EmptyState from "../components/ui/EmptyState";
import { createGoal, deleteGoal, getGoals, updateGoal } from "../services/goals";

const EMPTY_FORM = { goalName: "", targetAmount: "", currentAmount: "", deadline: "" };

export default function Goals() {
  const [items, setItems]     = useState([]);
  const [err, setErr]         = useState("");
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [amounts, setAmounts] = useState({});

  async function load() {
    setErr("");
    try {
      const res = await getGoals();
      setItems(res.data);
      const map = {};
      res.data.forEach((g) => { map[g._id] = String(g.currentAmount); });
      setAmounts(map);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load goals.");
    }
  }

  useEffect(() => { load(); }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await createGoal({
        goalName: form.goalName,
        targetAmount: Number(form.targetAmount),
        currentAmount: form.currentAmount ? Number(form.currentAmount) : 0,
        deadline: form.deadline || null,
      });
      setForm(EMPTY_FORM);
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await deleteGoal(id);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed.");
    }
  };

  const updateCurrent = async (goal) => {
    const newAmt = Number(amounts[goal._id]);
    if (isNaN(newAmt) || newAmt < 0) return;
    try {
      await updateGoal(goal._id, { currentAmount: newAmt });
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed.");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and achieve your financial targets</p>
        </div>

        {err && <Alert>{err}</Alert>}

        {/* Create goal form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Create a new goal</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Goal name" placeholder="e.g., Buy a Laptop" value={form.goalName} onChange={f("goalName")} required />
              <Input label="Target amount" type="number" min="1" step="0.01" placeholder="0.00" value={form.targetAmount} onChange={f("targetAmount")} required />
              <Input label="Already saved (optional)" type="number" min="0" step="0.01" placeholder="0.00" value={form.currentAmount} onChange={f("currentAmount")} />
              <Input label="Deadline (optional)" type="date" value={form.deadline} onChange={f("deadline")} />
            </div>
            <Button type="submit" loading={saving}>Create goal</Button>
          </form>
        </div>

        {/* Goals grid */}
        {items.length === 0 ? (
          <EmptyState title="No goals yet" message="Create your first savings goal above." />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((g) => {
              const percent = g.targetAmount > 0
                ? Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100)
                : 0;
              const done = percent >= 100;
              const remaining = Math.max(g.targetAmount - g.currentAmount, 0);

              return (
                <div
                  key={g._id}
                  className={`border rounded-xl p-6 shadow-sm transition ${
                    done ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{g.goalName}</span>
                      {done && (
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Completed</span>
                      )}
                    </div>
                    <button onClick={() => remove(g._id)} className="text-xs font-medium text-red-500 hover:text-red-700 ml-2 shrink-0">Delete</button>
                  </div>

                  {g.deadline && (
                    <p className="text-xs text-gray-500 mt-0.5 mb-3">
                      Target date: {new Date(g.deadline).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  )}

                  <div className="flex justify-between text-sm mb-2 mt-3">
                    <span className="text-gray-500">Saved: <span className="font-semibold text-gray-900">{g.currentAmount.toLocaleString()}</span></span>
                    <span className="text-gray-500">Goal: <span className="font-semibold text-gray-900">{g.targetAmount.toLocaleString()}</span></span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className={`h-2 rounded-full transition-all ${done ? "bg-green-500" : "bg-primary-500"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span className={`font-bold ${done ? "text-green-600" : "text-primary-600"}`}>{percent}%</span>
                    {!done && <span>{remaining.toLocaleString()} remaining</span>}
                  </div>

                  {/* Update amount inline */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input flex-1"
                      placeholder="Update saved amount"
                      value={amounts[g._id] ?? g.currentAmount}
                      onChange={(e) => setAmounts((prev) => ({ ...prev, [g._id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") updateCurrent(g); }}
                    />
                    <Button variant="secondary" type="button" onClick={() => updateCurrent(g)}>Update</Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Enter new saved amount and press Update or Enter</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
