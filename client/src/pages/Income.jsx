import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import EmptyState from "../components/ui/EmptyState";
import { createIncome, deleteIncome, getIncome, updateIncome } from "../services/income";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const EMPTY_FORM = { source: "", amount: "", date: today(), notes: "" };

export default function Income() {
  const [items, setItems]     = useState([]);
  const [err, setErr]         = useState("");
  const [saving, setSaving]   = useState(false);
  const [month, setMonth]     = useState(currentMonth());
  const [search, setSearch]   = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);

  async function load() {
    setErr("");
    try {
      const res = await getIncome({ month, ...(search ? { search } : {}) });
      setItems(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load income.");
    }
  }

  useEffect(() => { load(); }, [month]); // eslint-disable-line

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editingId) await updateIncome(editingId, payload);
      else           await createIncome(payload);
      setEditingId(null);
      setForm(EMPTY_FORM);
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (x) => {
    setEditingId(x._id);
    setForm({
      source: x.source,
      amount: String(x.amount),
      date: new Date(x.date).toISOString().slice(0, 10),
      notes: x.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => { setEditingId(null); setForm(EMPTY_FORM); };

  const remove = async (id) => {
    if (!window.confirm("Delete this income record?")) return;
    try {
      await deleteIncome(id);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed.");
    }
  };

  const total = items.reduce((s, x) => s + x.amount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Income</h1>
            <p className="text-sm text-gray-500 mt-0.5">Record and track your earnings</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Month</label>
            <input type="month" className="input w-36" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
        </div>

        {err && <Alert>{err}</Alert>}

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            {editingId ? "Edit income record" : "Add income"}
          </h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Source" placeholder="e.g., Salary, Freelance" value={form.source} onChange={f("source")} required />
              <Input label="Amount" type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={f("amount")} required />
              <Input label="Date" type="date" value={form.date} onChange={f("date")} required />
            </div>
            <Input label="Notes (optional)" placeholder="Add a note..." value={form.notes} onChange={f("notes")} />
            <div className="flex gap-2">
              <Button type="submit" loading={saving}>
                {editingId ? "Update" : "Add income"}
              </Button>
              {editingId && (
                <Button variant="secondary" type="button" onClick={cancel}>Cancel</Button>
              )}
            </div>
          </form>
        </div>

        {/* Search + total */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-48">
            <input
              className="input"
              placeholder="Search by source or notes... (press Enter)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm">
            <span className="text-gray-500">Total: </span>
            <span className="font-bold text-gray-900">{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Source</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((x) => (
                  <tr key={x._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(x.date).toISOString().slice(0, 10)}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">{x.source}</td>
                    <td className="px-6 py-3 text-right font-semibold text-green-700">
                      {x.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right whitespace-nowrap space-x-3">
                      <button onClick={() => startEdit(x)} className="text-xs font-medium text-primary-600 hover:text-primary-800">Edit</button>
                      <button onClick={() => remove(x._id)} className="text-xs font-medium text-red-500 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {items.length === 0 && (
            <EmptyState title="No income records" message="Add your first income record above." />
          )}
        </div>
      </div>
    </Layout>
  );
}
