import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

// ═══════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════
const API_BASE = "http://localhost:8000";

// ═══════════════════════════════════════════
// CONTEXTS
// ═══════════════════════════════════════════
const AuthContext = createContext(null);
const ConfigContext = createContext(null);
const PaperContext = createContext(null);

// ═══════════════════════════════════════════
// ICONS (inline SVG components)
// ═══════════════════════════════════════════
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  ),
  Upload: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
  ),
  Config: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  ),
  Generate: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  Review: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ),
  Analytics: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Lock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
  ),
  File: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  BookOpen: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
  ),
};

// ═══════════════════════════════════════════
// BLOOM & DIFFICULTY CONSTANTS
// ═══════════════════════════════════════════
const BLOOM_LEVELS = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];
const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
const QUESTION_TYPES = ["MCQ", "Short Answer", "Long Answer", "Case-based"];

const BLOOM_COLORS = {
  Remember: "#60a5fa", Understand: "#34d399", Apply: "#fbbf24",
  Analyze: "#f97316", Evaluate: "#a78bfa", Create: "#f472b6",
};
const DIFF_COLORS = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#ef4444" };

// ═══════════════════════════════════════════
// API HELPER
// ═══════════════════════════════════════════
async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ═══════════════════════════════════════════
// SUBJECT SELECTOR — reusable dropdown
// ═══════════════════════════════════════════
function SubjectSelector({ label = "Subject", required = true }) {
  const { subjects, selectedSubjectId, setSelectedSubjectId } = useContext(ConfigContext);

  return (
    <div>
      {label && <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">{label}{required && " *"}</label>}
      <select
        value={selectedSubjectId || ""}
        onChange={e => setSelectedSubjectId(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
      >
        <option value="">— Select a subject —</option>
        {subjects.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      {subjects.length === 0 && (
        <p className="text-[11px] text-amber-500 mt-1">No subjects yet. Create one in Settings.</p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════
function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("faculty@demo.local");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("faculty");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Login failed.");
        return;
      }
      login(data.user);
    } catch (e) {
      setError("Connection failed. Is backend running on localhost:8000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center p-10 w-1/2" style={{ background: "linear-gradient(160deg, #1e293b, #0f172a)" }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              <Icons.BookOpen />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}>
            QP Generation Engine
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Secure, role-based interface for academic question paper generation.
          </p>
          <div className="space-y-3 text-xs text-slate-500">
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Create subjects and upload study materials</div>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" />Configure patterns with Bloom & difficulty distribution</div>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Streamed generation with review & regeneration</div>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Analytics and reports for compliance</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center" style={{ background: "#1a2332" }}>
          <h2 className="text-xl font-semibold text-white mb-1">Login</h2>
          <p className="text-slate-500 text-xs mb-6">Use your institutional credentials.</p>

          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}

          <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full mb-4 px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
          />

          <label className="text-xs text-slate-400 mb-1.5 block">Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full mb-4 px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
          />

          <label className="text-xs text-slate-400 mb-1.5 block">Role</label>
          <div className="flex gap-2 mb-6">
            {["faculty", "admin"].map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${role === r ? "bg-blue-600 text-white" : "bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:border-slate-600"}`}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <button onClick={handleLogin} disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-sm text-white transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            {loading ? "Authenticating..." : `Login as ${role}`}
          </button>

          <p className="text-xs text-slate-600 mt-4 text-center">
            Demo — Faculty: faculty@demo.local / password123 · Admin: admin@demo.local / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════
function Sidebar({ active, setActive }) {
  const { user, logout } = useContext(AuthContext);
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Icons.Dashboard },
    { key: "upload", label: "Upload Materials", icon: Icons.Upload },
    { key: "config", label: "Exam Pattern Configuration", icon: Icons.Config },
    { key: "generate", label: "Generate Paper", icon: Icons.Generate },
    { key: "review", label: "Question Review", icon: Icons.Review },
    { key: "analytics", label: "Analytics", icon: Icons.Analytics },
    { key: "settings", label: "Settings", icon: Icons.Settings },
  ];

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-slate-800/80 h-screen sticky top-0" style={{ background: "#0d1520" }}>
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">QP Engine</span>
        </div>
      </div>

      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button key={item.key} onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive ? "bg-blue-600/15 text-blue-400" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
              }`}>
              <Icon />{item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-white font-medium">{user?.name || "Faculty"}</div>
            <div className="text-[10px] text-slate-500">{user?.email}</div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/15 text-blue-400">
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </span>
        </div>
        <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <Icons.Logout /> Logout
        </button>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
function DashboardPage({ onNavigate }) {
  const { subjects, selectedSubjectId, uploadedFiles } = useContext(ConfigContext);
  const { paper, setPaper } = useContext(PaperContext);
  const totalQ = paper ? paper.sections?.reduce((a, s) => a + (s.questions?.length || 0), 0) : 0;
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const [prevPapers, setPrevPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [viewingPaper, setViewingPaper] = useState(null); // full paper object for modal
  const [loadingView, setLoadingView] = useState(false);

  // Fetch previous papers when subject changes
  useEffect(() => {
    if (!selectedSubjectId) { setPrevPapers([]); return; }
    setLoadingPapers(true);
    api(`/subjects/${selectedSubjectId}/papers`)
      .then(data => setPrevPapers(data))
      .catch(() => setPrevPapers([]))
      .finally(() => setLoadingPapers(false));
  }, [selectedSubjectId]);

  // Open paper in modal — fetch full details
  const handleView = async (paperId) => {
    setLoadingView(true);
    try {
      const data = await api(`/papers/${paperId}`);
      setViewingPaper(data);
    } catch (e) { console.error(e); }
    setLoadingView(false);
  };

  // Load into Review tab
  const handleLoadIntoReview = (fullPaper) => {
    setPaper(fullPaper);
    setViewingPaper(null);
    onNavigate("review");
  };

  // Download paper via backend (PDF or DOCX), fallback TXT if no id
  const handleDownload = async (fullPaper, format = "pdf") => {
    if (!fullPaper?.id) {
      // fallback TXT
      let content = `QUESTION PAPER\nTitle: ${fullPaper.title || "Untitled"}\n${"=".repeat(50)}\n\n`;
      fullPaper.sections?.forEach(s => {
        content += `Section ${s.name}\n${"─".repeat(40)}\n`;
        s.questions?.forEach((q, i) => {
          content += `${i + 1}. ${q.text}\n   [${q.marks} marks | Bloom: ${q.bloom} | ${q.difficulty}]\n\n`;
        });
      });
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${(fullPaper.title || "question_paper").replace(/\s+/g, "_")}.txt`; a.click();
      URL.revokeObjectURL(url);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/export/${format}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paper_id: fullPaper.id }),
      });
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(fullPaper.title || "question_paper").replace(/\s+/g, "_")}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); alert(`Download failed: ${e.message}`); }
  };

  // Quick download without viewing (fetch paper then download)
  const handleQuickDownload = async (paperId, format = "pdf") => {
    try {
      const res = await fetch(`${API_BASE}/export/${format}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paper_id: paperId }),
      });
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `question_paper.${format}`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); alert(`Download failed: ${e.message}`); }
  };

  const stats = [
    { label: "Subjects Created", value: subjects.length, color: "#3b82f6" },
    { label: "Materials Uploaded", value: uploadedFiles.length, color: "#8b5cf6" },
    { label: "Papers Generated", value: prevPapers.length, color: "#10b981" },
    { label: "Questions Generated", value: totalQ, color: "#f59e0b" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-slate-500 text-xs mb-6">Overview of your question paper generation activity.</p>

      {selectedSubject && (
        <div className="mb-6 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <div>
            <div className="text-xs text-blue-300 font-medium">Active Subject</div>
            <div className="text-white text-sm font-semibold">{selectedSubject.name}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl p-5 border border-slate-800/60" style={{ background: "#111b27" }}>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="mt-3 h-1 rounded-full bg-slate-800">
              <div className="h-1 rounded-full" style={{ background: s.color, width: `${Math.min(100, (typeof s.value === "number" ? s.value : 50) * 20)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800/60 p-6 mb-6" style={{ background: "#111b27" }}>
        <h2 className="text-sm font-semibold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Upload Materials", page: "upload" },
            { label: "Configure Pattern", page: "config" },
            { label: "Generate Paper", page: "generate" },
            { label: "View Analytics", page: "analytics" },
          ].map(({ label, page }) => (
            <button key={page} onClick={() => onNavigate(page)}
              className="py-3 px-4 rounded-lg border border-slate-700/40 text-xs text-slate-400 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5 transition-all">
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── PREVIOUS PAPERS ── */}
      <div className="rounded-xl border border-slate-800/60 p-6" style={{ background: "#111b27" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Previous Question Papers</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {selectedSubject ? `Papers for ${selectedSubject.name}` : "Select a subject to see papers"}
            </p>
          </div>
          {prevPapers.length > 0 && (
            <span className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-1 rounded">
              {prevPapers.length} paper{prevPapers.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {!selectedSubjectId ? (
          <div className="py-8 flex flex-col items-center text-center">
            <Icons.File />
            <p className="text-slate-500 text-xs mt-3">Select a subject in Settings to view its papers.</p>
          </div>
        ) : loadingPapers ? (
          <div className="py-8 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : prevPapers.length === 0 ? (
          <div className="py-8 flex flex-col items-center text-center">
            <Icons.File />
            <p className="text-slate-500 text-xs mt-3">No papers generated yet for this subject.</p>
            <button onClick={() => onNavigate("generate")}
              className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              Generate First Paper
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {prevPapers.map((p) => (
              <div key={p.id}
                className="flex items-center gap-4 px-4 py-3 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all"
                style={{ background: "#0d1520" }}>
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #3b82f620, #8b5cf620)", border: "1px solid #3b82f630" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{p.title || "Untitled Paper"}</div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-slate-500">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] text-slate-500">{p.question_count || 0} questions</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleView(p.id)}
                    disabled={loadingView}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-all">
                    View
                  </button>
                  <button
                    onClick={() => handleQuickDownload(p.id, "pdf")}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-all">
                    PDF
                  </button>
                  <button
                    onClick={() => handleQuickDownload(p.id, "docx")}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all">
                    DOCX
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── VIEW PAPER MODAL ── */}
      {viewingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-700/50 shadow-2xl"
            style={{ background: "#0f1923" }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 flex-shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-white">{viewingPaper.title || "Untitled Paper"}</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {viewingPaper.created_at ? new Date(viewingPaper.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
                  {" · "}
                  {viewingPaper.sections?.reduce((a, s) => a + (s.questions?.length || 0), 0)} questions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLoadIntoReview(viewingPaper)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-violet-500/15 text-violet-400 border border-violet-500/20 hover:bg-violet-500/25 transition-all">
                  Open in Review
                </button>
                <button
                  onClick={() => handleDownload(viewingPaper, "pdf")}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-all">
                  PDF
                </button>
                <button
                  onClick={() => handleDownload(viewingPaper, "docx")}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all">
                  DOCX
                </button>
                <button onClick={() => setViewingPaper(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                  <Icons.X />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {viewingPaper.sections?.map((section, si) => (
                <div key={si}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Section {section.name}</h3>
                    <span className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">
                      {section.questions?.length || 0} questions
                    </span>
                  </div>
                  <div className="space-y-3">
                    {section.questions?.map((q, qi) => (
                      <div key={q.id} className="rounded-xl border border-slate-800/60 p-4" style={{ background: "#111b27" }}>
                        <div className="flex gap-3">
                          <span className="text-xs text-slate-500 font-mono flex-shrink-0 mt-0.5">{qi + 1}.</span>
                          <div className="flex-1">
                            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{q.text}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {q.question_type && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-400">{q.question_type}</span>
                              )}
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">{q.marks} marks</span>
                              {q.bloom && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white"
                                  style={{ background: (BLOOM_COLORS[q.bloom] || "#6366f1") + "55" }}>
                                  {q.bloom}
                                </span>
                              )}
                              {q.difficulty && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white"
                                  style={{ background: (DIFF_COLORS[q.difficulty] || "#fbbf24") + "55" }}>
                                  {q.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// UPLOAD MATERIALS — per subject
// ═══════════════════════════════════════════
function UploadPage() {
  const { uploadedFiles, setUploadedFiles, selectedSubjectId, subjects } = useContext(ConfigContext);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    if (!file) return;
    if (!selectedSubjectId) {
      setError("Please select a subject first.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // FIX: correct endpoint POST /subjects/{subject_id}/upload
      const res = await fetch(`${API_BASE}/subjects/${selectedSubjectId}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `Upload failed: ${res.status}`);
      }
      const data = await res.json();
      setUploadedFiles(prev => [...prev, { ...data, subject_id: selectedSubjectId }]);
    } catch (e) {
      setError(e.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const filesForSubject = uploadedFiles.filter(f => f.subject_id === selectedSubjectId);

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Upload Materials</h1>
      <p className="text-slate-500 text-xs mb-6">Upload any study material — PDF, Word, Excel, PPT, images, TXT and more.</p>

      {/* Subject selector */}
      <div className="rounded-xl border border-slate-800/60 p-5 mb-5" style={{ background: "#111b27" }}>
        <SubjectSelector label="Select Subject to Upload Into" />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
      )}

      {selectedSubjectId ? (
        <>
          {/* Upload zone */}
          <div className="rounded-xl border border-slate-800/60 p-5 mb-4" style={{ background: "#111b27" }}>
            <h3 className="text-sm font-semibold text-white mb-1">
              Upload Material for <span className="text-blue-400">{selectedSubject?.name}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">Supported: PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), Images (OCR), TXT, CSV, Markdown.</p>

            <label className={`flex flex-col items-center justify-center gap-1.5 py-7 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              uploading ? "border-blue-500/40 bg-blue-500/5" : "border-slate-700/40 hover:border-blue-500/30 hover:bg-slate-800/30"
            }`}>
              <input type="file" className="hidden"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.csv,.md,.png,.jpg,.jpeg,.bmp,.tiff,.tif,.webp"
                onChange={e => handleUpload(e.target.files?.[0])} disabled={uploading} />
              {uploading ? (
                <span className="text-xs text-blue-400 animate-pulse">Processing & indexing...</span>
              ) : (
                <>
                  <Icons.Upload />
                  <span className="text-xs text-slate-400">Choose file to upload</span>
                  <span className="text-[10px] text-slate-600 mt-1">PDF, Word, Excel, PPT, Images, TXT, CSV</span>
                </>
              )}
            </label>
          </div>

          {/* Uploaded files for this subject */}
          <div className="rounded-xl border border-slate-800/60 p-5" style={{ background: "#111b27" }}>
            <h3 className="text-sm font-semibold text-white mb-3">
              Uploaded Files
              <span className="ml-2 text-[10px] text-slate-500 font-normal">{filesForSubject.length} file(s)</span>
            </h3>
            {filesForSubject.length > 0 ? (
              <div className="space-y-2">
                {filesForSubject.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/40 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 flex-1 truncate">{f.filename}</span>
                    {f.chunks_indexed && (
                      <span className="text-slate-500">{f.chunks_indexed} chunks</span>
                    )}
                    <span className="text-emerald-400 text-[10px]">{f.status || "indexed"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-600">No files uploaded for this subject yet.</p>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-slate-700/30 p-10 flex flex-col items-center" style={{ background: "#111b27" }}>
          <Icons.File />
          <p className="text-slate-500 text-sm mt-4">Select a subject above to upload materials.</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// EXAM PATTERN CONFIGURATION
// ═══════════════════════════════════════════
function ConfigPage() {
  const { pattern, setPattern, patternSaved, setPatternSaved } = useContext(ConfigContext);

  const addSection = () => {
    const names = ["A", "B", "C", "D", "E", "F"];
    const nextName = names[pattern.sections.length] || `S${pattern.sections.length + 1}`;
    setPattern(prev => ({
      ...prev,
      sections: [...prev.sections, {
        section_name: nextName,
        question_type: "Short Answer",
        number_of_questions: 3,
        marks_per_question: 2,
        bloom_level: "Understand",
        difficulty: "Medium",
        internal_choice: false,
      }],
    }));
    setPatternSaved(false);
  };

  const removeSection = (idx) => {
    setPattern(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== idx) }));
    setPatternSaved(false);
  };

  const updateSection = (idx, field, value) => {
    setPattern(prev => {
      const sections = [...prev.sections];
      sections[idx] = { ...sections[idx], [field]: value };
      return { ...prev, sections };
    });
    setPatternSaved(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-white">Exam Pattern Configuration</h1>
        <button onClick={addSection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 transition-all">
          <Icons.Plus /> Add section
        </button>
      </div>
      <p className="text-slate-500 text-xs mb-4">Define sections with question type, count, marks, Bloom level and difficulty.</p>

      {patternSaved && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium"><Icons.Check /> Pattern saved.</div>
          <button onClick={() => setPatternSaved(false)} className="text-slate-500 hover:text-slate-300"><Icons.X /></button>
        </div>
      )}

      <div className="space-y-4">
        {pattern.sections.map((section, idx) => (
          <div key={idx} className="rounded-xl border border-slate-800/60 p-5" style={{ background: "#111b27" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Section {idx + 1}</h3>
              <button onClick={() => removeSection(idx)} className="px-2.5 py-1 rounded text-[11px] font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all">
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Section Name</label>
                <input value={section.section_name} onChange={e => updateSection(idx, "section_name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Question Type</label>
                <select value={section.question_type} onChange={e => updateSection(idx, "question_type", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none">
                  {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">No. of Questions</label>
                <input type="number" min={1} value={section.number_of_questions}
                  onChange={e => updateSection(idx, "number_of_questions", parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Marks / Question</label>
                <input type="number" min={1} value={section.marks_per_question}
                  onChange={e => updateSection(idx, "marks_per_question", parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Bloom Level</label>
                <select value={section.bloom_level} onChange={e => updateSection(idx, "bloom_level", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none">
                  {BLOOM_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Difficulty</label>
                <select value={section.difficulty} onChange={e => updateSection(idx, "difficulty", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none">
                  {DIFFICULTY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Preview row */}
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-400">{section.number_of_questions} × {section.question_type}</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-400">{section.marks_per_question} marks each</span>
              <span className="px-2 py-1 rounded text-white" style={{ background: BLOOM_COLORS[section.bloom_level] + "44", border: `1px solid ${BLOOM_COLORS[section.bloom_level]}44` }}>
                Bloom: {section.bloom_level}
              </span>
              <span className="px-2 py-1 rounded text-white" style={{ background: DIFF_COLORS[section.difficulty] + "44", border: `1px solid ${DIFF_COLORS[section.difficulty]}44` }}>
                {section.difficulty}
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-400">
                Total: {section.number_of_questions * section.marks_per_question} marks
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-800/60 p-5" style={{ background: "#111b27" }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Total</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {pattern.sections.reduce((a, s) => a + s.number_of_questions, 0)} questions ·{" "}
              {pattern.sections.reduce((a, s) => a + s.number_of_questions * s.marks_per_question, 0)} marks
            </p>
          </div>
          <button onClick={() => setPatternSaved(true)}
            className="px-5 py-2 rounded-lg text-xs font-medium text-white transition-all"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            Save Pattern
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// GENERATE PAPER (SSE STREAMING)
// ═══════════════════════════════════════════
function GeneratePage({ onNavigate }) {
  const { pattern, uploadedFiles, selectedSubjectId, subjects } = useContext(ConfigContext);
  const { setPaper } = useContext(PaperContext);
  const [generating, setGenerating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [paperTitle, setPaperTitle] = useState("Untitled Paper");
  const stepsEndRef = useRef(null);

  useEffect(() => {
    stepsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps]);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const filesForSubject = uploadedFiles.filter(f => f.subject_id === selectedSubjectId);

  const startGeneration = async () => {
    if (!selectedSubjectId) {
      setError("Please select a subject first.");
      return;
    }
    setGenerating(true);
    setSteps([]);
    setError("");
    setDone(false);

    // FIX: Map frontend pattern fields to what the backend expects
    // Backend expects: name, type, count, marksPerQuestion, bloomLevel, difficulty
    const backendSections = pattern.sections.map(s => ({
      name: s.section_name,
      type: s.question_type,
      count: s.number_of_questions,
      marksPerQuestion: s.marks_per_question,
      bloomLevel: s.bloom_level,
      difficulty: s.difficulty,
    }));

    try {
      const res = await fetch(`${API_BASE}/generate/paper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subject_id: selectedSubjectId,   // FIX: now included
          title: paperTitle,
          pattern: { sections: backendSections },
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "step") {
              setSteps(prev => [...prev, event.message]);
            } else if (event.type === "error") {
              setError(event.message);
            } else if (event.type === "done") {
              if (event.payload) setPaper(event.payload);
              setDone(true);
            }
          } catch (e) { /* skip malformed */ }
        }
      }
    } catch (e) {
      setError("Connection failed. Is backend running on localhost:8000?");
    } finally {
      setGenerating(false);
    }
  };

  const totalQuestions = pattern.sections.reduce((a, s) => a + (s.number_of_questions || 0), 0);
  const totalMarks = pattern.sections.reduce((a, s) => a + (s.number_of_questions * s.marks_per_question || 0), 0);

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Generate Question Paper</h1>
      <p className="text-slate-500 text-xs mb-6">Streams questions in real-time using your uploaded materials.</p>

      {!generating && !done && (
        <div className="space-y-4">
          {/* Subject selector */}
          <div className="rounded-xl border border-slate-800/60 p-5" style={{ background: "#111b27" }}>
            <SubjectSelector label="Select Subject" />
            {selectedSubjectId && filesForSubject.length === 0 && (
              <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                No materials uploaded for this subject. Please upload PDFs first.
              </div>
            )}
            {selectedSubjectId && filesForSubject.length > 0 && (
              <p className="mt-2 text-[11px] text-emerald-400">{filesForSubject.length} material(s) ready for {selectedSubject?.name}</p>
            )}
          </div>

          {/* Paper title */}
          <div className="rounded-xl border border-slate-800/60 p-5" style={{ background: "#111b27" }}>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Paper Title</label>
            <input value={paperTitle} onChange={e => setPaperTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="e.g. Mid-Semester Examination 2025" />
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-slate-800/60 p-5" style={{ background: "#111b27" }}>
            <h3 className="text-sm font-semibold text-white mb-4">Pattern Summary</h3>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="p-3 rounded-lg bg-slate-800/40">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Sections</div>
                <div className="text-lg font-bold text-white">{pattern.sections.length}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Total Questions</div>
                <div className="text-lg font-bold text-white">{totalQuestions}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Total Marks</div>
                <div className="text-lg font-bold text-white">{totalMarks}</div>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {pattern.sections.map((s, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 text-xs text-slate-400 px-3 py-2 rounded-lg bg-slate-800/30">
                  <span className="font-semibold text-white w-8">Sec {s.section_name}</span>
                  <span>{s.question_type}</span>
                  <span className="text-slate-600">|</span>
                  <span>{s.number_of_questions} Q × {s.marks_per_question} marks</span>
                  <span className="text-slate-600">|</span>
                  <span style={{ color: BLOOM_COLORS[s.bloom_level] }}>Bloom: {s.bloom_level}</span>
                  <span className="text-slate-600">|</span>
                  <span style={{ color: DIFF_COLORS[s.difficulty] }}>{s.difficulty}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
            )}

            <button onClick={startGeneration}
              disabled={!selectedSubjectId || filesForSubject.length === 0}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-30"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              Generate Question Paper
            </button>
          </div>
        </div>
      )}

      {/* Streaming Progress */}
      {(generating || steps.length > 0) && (
        <div className="rounded-xl border border-slate-800/60 p-6" style={{ background: "#111b27" }}>
          <div className="flex items-center gap-2 mb-4">
            {generating && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
            <h3 className="text-sm font-semibold text-white">
              {generating ? "Generating..." : done ? "Generation Complete" : "Progress"}
            </h3>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1 pr-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs py-1">
                <span className="text-emerald-400"><Icons.Check /></span>
                <span className="text-slate-400">{step}</span>
              </div>
            ))}
            <div ref={stepsEndRef} />
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
          )}

          {done && !error && (
            <div className="mt-5">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-4">
                Paper generated successfully!
              </div>
              <button onClick={() => onNavigate("review")}
                className="px-5 py-2 rounded-lg text-xs font-medium text-white"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                Go to Question Review
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// QUESTION RENDERER
// ═══════════════════════════════════════════
function QuestionRenderer({ text, questionType }) {
  if (!text) return null;

  if (questionType?.toUpperCase() === "MCQ") {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    let question = "";
    const options = [];
    let answer = "";

    for (const line of lines) {
      if (line.toUpperCase().startsWith("QUESTION:")) {
        question = line.replace(/^QUESTION:\s*/i, "");
      } else if (/^[A-D]\)/.test(line)) {
        options.push(line);
      } else if (line.toUpperCase().startsWith("ANSWER:")) {
        answer = line.replace(/^ANSWER:\s*/i, "").trim().charAt(0).toUpperCase();
      } else if (!question) {
        question += line + " ";
      }
    }

    if (!question && options.length === 0) {
      return <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>;
    }

    return (
      <div>
        <p className="text-sm text-slate-300 leading-relaxed font-medium mb-3">{question}</p>
        <div className="space-y-2 ml-1">
          {options.map((opt, i) => {
            const letter = opt.charAt(0).toUpperCase();
            const isCorrect = letter === answer;
            return (
              <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                isCorrect
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                  : "bg-slate-800/30 border border-slate-700/30 text-slate-400"
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                  isCorrect ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-400"
                }`}>{letter}</span>
                <span>{opt.substring(2).trim()}</span>
                {isCorrect && <span className="ml-auto text-[10px] font-medium text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">Correct</span>}
              </div>
            );
          })}
        </div>
        {answer && <div className="mt-2 text-[11px] text-emerald-500 font-medium">Answer: {answer}</div>}
      </div>
    );
  }

  if (questionType?.toUpperCase() === "CASE-BASED") {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    let caseText = "";
    const subQuestions = [];

    for (const line of lines) {
      if (line.toUpperCase().startsWith("CASE:")) {
        caseText = line.replace(/^CASE:\s*/i, "");
      } else if (/^\([a-c]\)/i.test(line)) {
        subQuestions.push(line);
      } else if (subQuestions.length === 0 && !caseText) {
        caseText += line + " ";
      }
    }

    if (!caseText && subQuestions.length === 0) {
      return <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>;
    }

    return (
      <div>
        <div className="px-4 py-3 rounded-lg bg-blue-500/5 border border-blue-500/20 mb-3">
          <div className="text-[10px] uppercase tracking-wider text-blue-400 font-medium mb-1">Case Study</div>
          <p className="text-sm text-slate-300 leading-relaxed">{caseText}</p>
        </div>
        {subQuestions.length > 0 && (
          <div className="space-y-1.5 ml-1">
            {subQuestions.map((sq, i) => (
              <p key={i} className="text-sm text-slate-300">{sq}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>;
}

// ═══════════════════════════════════════════
// QUESTION REVIEW
// ═══════════════════════════════════════════
function ReviewPage() {
  const { paper, setPaper } = useContext(PaperContext);
  const { selectedSubjectId } = useContext(ConfigContext);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [lockedIds, setLockedIds] = useState(new Set());
  const [regeneratingId, setRegeneratingId] = useState(null);

  if (!paper || !paper.sections?.length) {
    return (
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Question Review</h1>
        <p className="text-slate-500 text-xs mb-6">Edit, regenerate, lock or delete questions before export.</p>
        <div className="rounded-xl border border-slate-800/60 p-10 flex flex-col items-center justify-center" style={{ background: "#111b27" }}>
          <Icons.File />
          <p className="text-slate-500 text-sm mt-4">No paper generated yet. Generate a paper first.</p>
        </div>
      </div>
    );
  }

  const handleEdit = async (questionId) => {
    try {
      await api("/question/edit", {
        method: "POST",
        body: JSON.stringify({ question_id: questionId, text: editText }),
      });
      setPaper(prev => ({
        ...prev,
        sections: prev.sections.map(s => ({
          ...s,
          questions: s.questions.map(q => q.id === questionId ? { ...q, text: editText } : q),
        })),
      }));
      setEditingId(null);
    } catch (e) { console.error(e); }
  };

  const handleRegenerate = async (q) => {
    setRegeneratingId(q.id);
    try {
      // FIX: now sends subject_id, question_type, bloom_level, difficulty, marks
      const data = await api("/regenerate/question", {
        method: "POST",
        body: JSON.stringify({
          question_id: q.id,
          subject_id: selectedSubjectId,
          question_type: q.question_type || "Short Answer",
          bloom_level: q.bloom || "Understand",
          difficulty: q.difficulty || "Medium",
          marks: q.marks || 2,
        }),
      });
      setPaper(prev => ({
        ...prev,
        sections: prev.sections.map(s => ({
          ...s,
          questions: s.questions.map(qn => qn.id === q.id ? { ...qn, text: data.text } : qn),
        })),
      }));
    } catch (e) { console.error(e); }
    setRegeneratingId(null);
  };

  const handleDelete = async (questionId) => {
    try {
      await fetch(`${API_BASE}/question/${questionId}`, { method: "DELETE", credentials: "include" });
      setPaper(prev => ({
        ...prev,
        sections: prev.sections.map(s => ({
          ...s,
          questions: s.questions.filter(q => q.id !== questionId),
        })),
      }));
    } catch (e) { console.error(e); }
  };

  const toggleLock = (id) => {
    setLockedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const exportAs = async (format) => {
    if (!paper?.id) {
      // Fallback: client-side TXT if no paper ID
      let content = `QUESTION PAPER\nTitle: ${paper.title || "Untitled"}\n${"=".repeat(50)}\n\n`;
      paper.sections.forEach(s => {
        content += `Section ${s.name}\n${"─".repeat(40)}\n`;
        s.questions.forEach((q, i) => {
          content += `${i + 1}. ${q.text}\n   [${q.marks} marks | Bloom: ${q.bloom} | ${q.difficulty}]\n\n`;
        });
      });
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "question_paper.txt"; a.click();
      URL.revokeObjectURL(url);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/export/${format}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paper_id: paper.id }),
      });
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(paper.title || "question_paper").replace(/\s+/g, "_")}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export error:", e);
      alert(`Export failed: ${e.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-white">Question Review</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-white transition-all">Save Draft</button>
          <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 transition-all">Submit for Approval</button>
          <button onClick={() => exportAs("txt")} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-700/40 text-slate-300 border border-slate-600/40 hover:bg-slate-700/60 transition-all">TXT</button>
          <button onClick={() => exportAs("pdf")} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-all">PDF</button>
          <button onClick={() => exportAs("docx")} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-all">DOCX</button>
        </div>
      </div>
      <p className="text-slate-500 text-xs mb-6">Edit, regenerate, lock or delete questions before export.</p>

      {!selectedSubjectId && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
          No subject selected — regeneration will not work without a subject.
        </div>
      )}

      {paper.sections.map((section, si) => (
        <div key={si} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-white">Section {section.name}</h2>
            <span className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">{section.questions?.length || 0} questions</span>
          </div>

          <div className="space-y-3">
            {section.questions?.map((q, qi) => {
              const isLocked = lockedIds.has(q.id);
              const isEditing = editingId === q.id;
              const isRegenerating = regeneratingId === q.id;

              return (
                <div key={q.id} className={`rounded-xl border p-5 transition-all ${
                  isLocked ? "border-amber-500/30 bg-amber-500/5" : "border-slate-800/60"
                }`} style={!isLocked ? { background: "#111b27" } : {}}>
                  <div className="flex items-start gap-4">
                    <span className="text-xs text-slate-500 font-mono mt-0.5 flex-shrink-0">{qi + 1}.</span>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div>
                          <textarea value={editText} onChange={e => setEditText(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-blue-500/30 text-white text-sm focus:outline-none resize-none"
                            rows={6} />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleEdit(q.id)}
                              className="px-3 py-1 rounded text-[11px] font-medium bg-blue-600 text-white">Save</button>
                            <button onClick={() => setEditingId(null)}
                              className="px-3 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-white">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <QuestionRenderer text={q.text} questionType={q.question_type} />
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {q.question_type && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-400">{q.question_type}</span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">{q.marks} marks</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white"
                          style={{ background: (BLOOM_COLORS[q.bloom] || "#6366f1") + "55" }}>
                          Bloom: {q.bloom}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white"
                          style={{ background: (DIFF_COLORS[q.difficulty] || "#fbbf24") + "55" }}>
                          {q.difficulty}
                        </span>
                        {q.similarity !== undefined && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            q.similarity > 0.5 ? "bg-red-500/20 text-red-400" : "bg-emerald-500/15 text-emerald-400"
                          }`}>Sim: {(q.similarity * 100).toFixed(0)}%</span>
                        )}
                      </div>
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => { setEditingId(q.id); setEditText(q.text); }}
                          disabled={isLocked}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-30"
                          title="Edit"><Icons.Edit /></button>
                        <button onClick={() => handleRegenerate(q)}
                          disabled={isLocked || isRegenerating}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all disabled:opacity-30"
                          title="Regenerate">
                          {isRegenerating ? <span className="animate-spin inline-block"><Icons.Refresh /></span> : <Icons.Refresh />}
                        </button>
                        <button onClick={() => toggleLock(q.id)}
                          className={`p-1.5 rounded-lg transition-all ${isLocked ? "text-amber-400 bg-amber-500/15" : "text-slate-500 hover:text-amber-400 hover:bg-amber-500/10"}`}
                          title="Lock"><Icons.Lock /></button>
                        <button onClick={() => handleDelete(q.id)}
                          disabled={isLocked}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30"
                          title="Delete"><Icons.Trash /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════
function AnalyticsPage() {
  const { paper } = useContext(PaperContext);

  const bloomCounts = {};
  const diffCounts = {};
  let totalQ = 0;

  if (paper?.sections) {
    paper.sections.forEach(s => {
      s.questions?.forEach(q => {
        totalQ++;
        bloomCounts[q.bloom] = (bloomCounts[q.bloom] || 0) + 1;
        diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
      });
    });
  }

  const bloomData = BLOOM_LEVELS.map(l => ({ name: l, value: bloomCounts[l] || 0, fill: BLOOM_COLORS[l] }));
  const diffData = DIFFICULTY_LEVELS.map(l => ({ name: l, value: diffCounts[l] || 0, fill: DIFF_COLORS[l] }));
  const radarData = BLOOM_LEVELS.map(l => ({ subject: l, count: bloomCounts[l] || 0, fullMark: totalQ || 5 }));

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Analytics</h1>
      <p className="text-slate-500 text-xs mb-6">Bloom level distribution, difficulty balance, and generation metrics.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Questions", value: totalQ },
          { label: "Bloom Levels Used", value: Object.keys(bloomCounts).length },
          { label: "Difficulty Levels Used", value: Object.keys(diffCounts).length },
          { label: "Repetition %", value: "0%" },
        ].map((c, i) => (
          <div key={i} className="rounded-xl border border-slate-800/60 p-4" style={{ background: "#111b27" }}>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{c.label}</div>
            <div className="text-xl font-bold text-white">{c.value}</div>
          </div>
        ))}
      </div>

      {totalQ === 0 ? (
        <div className="rounded-xl border border-slate-800/60 p-10 flex flex-col items-center" style={{ background: "#111b27" }}>
          <Icons.Analytics />
          <p className="text-slate-500 text-sm mt-4">Generate a paper to see analytics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800/60 p-5" style={{ background: "#111b27" }}>
            <h3 className="text-sm font-semibold text-white mb-4">Bloom's Taxonomy Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={bloomData.filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  outerRadius={90} innerRadius={40} paddingAngle={3} strokeWidth={0}>
                  {bloomData.filter(d => d.value > 0).map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12, color: "#fff" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-800/60 p-5" style={{ background: "#111b27" }}>
            <h3 className="text-sm font-semibold text-white mb-4">Difficulty Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={diffData} barSize={48}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12, color: "#fff" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {diffData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-800/60 p-5 lg:col-span-2" style={{ background: "#111b27" }}>
            <h3 className="text-sm font-semibold text-white mb-4">Bloom's Taxonomy Coverage Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Radar name="Questions" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// SETTINGS — Subject management
// ═══════════════════════════════════════════
function SettingsPage() {
  const { subjects, setSubjects, selectedSubjectId, setSelectedSubjectId } = useContext(ConfigContext);
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleCreateSubject = async () => {
    if (!newSubject.name.trim()) {
      setError("Subject name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      // FIX: correct endpoint POST /subjects with {name, description}
      const data = await api("/subjects", {
        method: "POST",
        body: JSON.stringify({
          name: newSubject.name.trim(),
          description: newSubject.description.trim(),
        }),
      });
      const created = { id: data.id, name: data.name, description: data.description };
      setSubjects(prev => [...prev, created]);
      setSelectedSubjectId(data.id);   // auto-select newly created subject
      setNewSubject({ name: "", description: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError("Failed to create subject. Is backend running?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Subjects - Settings</h1>
      <p className="text-slate-500 text-xs mb-6">Manage subjects and system configuration.</p>

      {/* Create Subject */}
      <div className="rounded-xl border border-slate-800/60 p-5 mb-4" style={{ background: "#111b27" }}>
        <h3 className="text-sm font-semibold text-white mb-4">Create New Subject</h3>

        {saved && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <Icons.Check /> Subject created and selected.
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Subject Name *</label>
            <input
              value={newSubject.name}
              onChange={e => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Machine Learning"
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Description</label>
            <input
              value={newSubject.description}
              onChange={e => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g. 5th Sem AI elective"
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleCreateSubject} disabled={saving}
            className="px-5 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            {saving ? "Creating..." : "Create Subject"}
          </button>
        </div>
      </div>

      {/* Subject List */}
      <div className="rounded-xl border border-slate-800/60 p-5 mb-4" style={{ background: "#111b27" }}>
        <h3 className="text-sm font-semibold text-white mb-4">
          All Subjects
          <span className="ml-2 text-[10px] text-slate-500 font-normal">{subjects.length} total</span>
        </h3>

        {subjects.length === 0 ? (
          <p className="text-[11px] text-slate-600">No subjects yet. Create one above.</p>
        ) : (
          <div className="space-y-2">
            {subjects.map(s => (
              <div key={s.id}
                onClick={() => setSelectedSubjectId(s.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all border ${
                  selectedSubjectId === s.id
                    ? "border-blue-500/40 bg-blue-500/10"
                    : "border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/30"
                }`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedSubjectId === s.id ? "bg-blue-400" : "bg-slate-600"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium">{s.name}</div>
                  {s.description && <div className="text-[11px] text-slate-500 truncate">{s.description}</div>}
                </div>
                {selectedSubjectId === s.id && (
                  <span className="text-[10px] text-blue-400 font-medium px-2 py-0.5 bg-blue-500/15 rounded">Active</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="rounded-xl border border-slate-800/60 p-5" style={{ background: "#111b27" }}>
        <h3 className="text-sm font-semibold text-white mb-4">System Information</h3>
        <div className="space-y-2 text-xs text-slate-400">
          {[
            ["Backend", "FastAPI + PostgreSQL"],
            ["Vector Store", "FAISS (SentenceTransformer)"],
            ["LLM Provider", "OpenAI API (gpt-4.1-mini)"],
            ["Similarity Threshold", "0.70 cosine"],
            ["Regeneration Cap", "3 attempts"],
            ["Temperature", "0.7"],
            ["API Base", API_BASE],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-slate-800/40 last:border-0">
              <span>{label}</span><span className="text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP SHELL
// ═══════════════════════════════════════════
function AppShell() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage onNavigate={setActivePage} />;
      case "upload": return <UploadPage />;
      case "config": return <ConfigPage />;
      case "generate": return <GeneratePage onNavigate={setActivePage} />;
      case "review": return <ReviewPage />;
      case "analytics": return <AnalyticsPage />;
      case "settings": return <SettingsPage />;
      default: return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#0f1923", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <Sidebar active={activePage} setActive={setActivePage} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════
// ROOT (CONTEXT PROVIDERS + AUTH GATE)
// ═══════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function checkSession() {
      try {
        const data = await api("/auth/me");
        if (!cancelled && data?.user) setUser(data.user);
      } catch (e) {
        // 401 = no session, stay on login
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }
    checkSession();
    return () => { cancelled = true; };
  }, []);

  const login = (u) => setUser(u);
  const logout = async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch (e) {}
    setUser(null);
  };

  // ── Config state ──
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  // Load subjects from backend once logged in
  useEffect(() => {
    if (!user) return;
    api("/subjects")
      .then(data => {
        setSubjects(data);
        // Auto-select first subject if available
        if (data.length > 0 && !selectedSubjectId) {
          setSelectedSubjectId(data[0].id);
        }
      })
      .catch(() => {});
  }, [user]);

  const [pattern, setPattern] = useState({
    sections: [{
      section_name: "A",
      question_type: "Short Answer",
      number_of_questions: 3,
      marks_per_question: 2,
      bloom_level: "Understand",
      difficulty: "Medium",
      internal_choice: false,
    }],
  });
  const [patternSaved, setPatternSaved] = useState(false);

  // ── Paper state ──
  const [paper, setPaper] = useState(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1923" }}>
        <style>{`@keyframes qp-spin { to { transform: rotate(360deg); } }`}</style>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            style={{ animation: "qp-spin 0.8s linear infinite" }} />
          <span className="text-slate-500 text-xs">Checking session...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ConfigContext.Provider value={{
        uploadedFiles, setUploadedFiles,
        subjects, setSubjects,
        selectedSubjectId, setSelectedSubjectId,
        pattern, setPattern,
        patternSaved, setPatternSaved,
      }}>
        <PaperContext.Provider value={{ paper, setPaper }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background: #0f1923; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: #475569; }
            input[type="number"]::-webkit-inner-spin-button { opacity: 0.3; }
            select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
              background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
          `}</style>
          {user ? <AppShell /> : <LoginPage />}
        </PaperContext.Provider>
      </ConfigContext.Provider>
    </AuthContext.Provider>
  );
}