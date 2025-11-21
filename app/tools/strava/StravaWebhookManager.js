"use client";
import { useEffect, useState } from "react";

export default function StravaWebhookManager() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [global, setGlobal] = useState({
    client_id: "",
    client_secret: ""
  });
  const [form, setForm] = useState({
    callback_url: "",
    verify_token: ""
  });

  const fetchSubs = async () => {
    const { client_id: cid, client_secret: csec } = global;
    if (!cid || !csec) {
      setSubs([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/strava/webhook/list?client_id=${encodeURIComponent(cid)}&client_secret=${encodeURIComponent(csec)}`);
      const data = await res.json();
      setSubs(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setError("Failed to Pull Subscriptions");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (global.client_id && global.client_secret) {
      fetchSubs();
    } else {
      setSubs([]);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [global.client_id, global.client_secret]);

  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      await fetch(`/api/strava/webhook/delete?id=${id}&client_id=${global.client_id}&client_secret=${global.client_secret}`, { method: "DELETE" });
      fetchSubs();
    } catch (e) {
      setError("Failed to Delete Subscription");
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await fetch("/api/strava/webhook/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, client_id: global.client_id, client_secret: global.client_secret })
      });
      setForm({ callback_url: "", verify_token: "" });
      fetchSubs();
    } catch (e) {
      setError("Failed to Add Subscription");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto" }}>
      <h2 style={{
        fontSize: 32,
        fontWeight: 800,
        letterSpacing: 1,
        color: '#0070f3',
        marginBottom: 8,
        textShadow: '0 2px 8px #e3e3e3'
      }}>Strava Webhook Management</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, alignItems: 'center', background: '#f5f7fa', padding: 20, borderRadius: 8, boxShadow: '0 1px 4px #eaeaea' }}>
        <input
          style={{ flex: 1, padding: '10px 14px', border: '2px solid #ffb300', borderRadius: 6, background: '#fffbe6', fontWeight: 600 }}
          placeholder="STRAVA_CLIENT_ID"
          value={global.client_id}
          onChange={e => setGlobal(g => ({ ...g, client_id: e.target.value }))}
        />
        <input
          style={{ flex: 2, padding: '10px 14px', border: '2px solid #00bfae', borderRadius: 6, background: '#e6fffb', fontWeight: 600 }}
          placeholder="STRAVA_CLIENT_SECRET"
          value={global.client_secret}
          onChange={e => setGlobal(g => ({ ...g, client_secret: e.target.value }))}
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleAdd} style={{ marginBottom: 24, width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          style={{ flex: 2, padding: '8px 12px', border: '1px solid #aaa', borderRadius: 4, background: '#f8fafd' }}
          placeholder="callback_url"
          value={form.callback_url}
          onChange={e => setForm(f => ({ ...f, callback_url: e.target.value }))}
          required
        />
        <input
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #c7e0ff', borderRadius: 4, background: '#e6f2ff' }}
          placeholder="verify_token"
          value={form.verify_token}
          onChange={e => setForm(f => ({ ...f, verify_token: e.target.value }))}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ flex: 'none', padding: '8px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
        >
          Subscribe New Webhook
        </button>
      </form>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#fff',
          boxShadow: '0 2px 8px #eaeaea',
          marginBottom: 24
        }}
      >
        <thead>
          <tr style={{ background: '#f5f7fa' }}>
            <th style={{ border: '1px solid #e3e3e3', padding: 10, fontWeight: 700 }}>ID</th>
            <th style={{ border: '1px solid #e3e3e3', padding: 10, fontWeight: 700 }}>callback_url</th>
            <th style={{ border: '1px solid #e3e3e3', padding: 10, fontWeight: 700 }}>created_at</th>
            <th style={{ border: '1px solid #e3e3e3', padding: 10, fontWeight: 700 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((sub, idx) => (
            <tr
              key={sub.id}
              style={{ background: idx % 2 === 0 ? '#fafdff' : '#f5f7fa', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#e6f2ff')}
              onMouseOut={e => (e.currentTarget.style.background = idx % 2 === 0 ? '#fafdff' : '#f5f7fa')}
            >
              <td style={{ border: '1px solid #e3e3e3', padding: 10 }}>{sub.id}</td>
              <td style={{ border: '1px solid #e3e3e3', padding: 10 }}>{sub.callback_url}</td>
              <td style={{ border: '1px solid #e3e3e3', padding: 10 }}>{sub.created_at}</td>
              <td style={{ border: '1px solid #e3e3e3', padding: 10 }}>
                <button
                  onClick={() => handleDelete(sub.id)}
                  disabled={loading}
                  style={{
                    background: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 16px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Delete Subscription
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div>Loading...</div>}
    </div>
  );
}
