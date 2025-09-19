import { useEffect, useMemo, useState } from "react";
import { getJson } from "../../lib/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { FiBriefcase, FiUsers, FiFileText, FiTrendingUp, FiRefreshCw } from "react-icons/fi";

type TrendPoint = {
  _id: string;
  count?: number;
  total?: number;
  employees?: number;
  employers?: number;
  admins?: number;
};

type TrendsResponse = {
  period: string;
  groupBy: string;
  dateRange: { start: string; end: string };
  trends: {
    jobCounts?: TrendPoint[];
    userCounts?: TrendPoint[];
    applicationCounts?: TrendPoint[];
  };
};

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number | JSX.Element;
  sub?: string;
  icon: JSX.Element;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
        <div className={`rounded-lg ${accent} p-2 text-white`}>{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-gray-500">{sub}</div> : null}
    </div>
  );
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

function formatDateKey(key: string) {
  try {
    if (key.length === 10) return dateFmt.format(new Date(key + "T00:00:00Z"));
    return key;
  } catch {
    return key;
  }
}

function toChartData(points: TrendPoint[] | undefined, valueKey: keyof TrendPoint) {
  return (points || []).map((p) => ({
    date: formatDateKey(p._id),
    value: (p[valueKey] as number) || 0,
  }));
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState("30d");
  const [groupBy, setGroupBy] = useState("day");
  const [tab, setTab] = useState<"overview" | "jobs" | "applications" | "users">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<TrendsResponse | null>(null);
  const [jobs, setJobs] = useState<TrendsResponse | null>(null);
  const [applications, setApplications] = useState<TrendsResponse | null>(null);
  const [jobList, setJobList] = useState<any[]>([]);
  const [jobListLoading, setJobListLoading] = useState(false);
  const [applicationList, setApplicationList] = useState<any[]>([]);
  const [applicationListLoading, setApplicationListLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const qs = `?period=${encodeURIComponent(period)}&groupBy=${encodeURIComponent(groupBy)}`;
        const [u, j, a] = await Promise.all([
          getJson<TrendsResponse>(`/api/trends/users${qs}`),
          getJson<TrendsResponse>(`/api/trends/jobs${qs}`),
          getJson<TrendsResponse>(`/api/trends/applications${qs}`),
        ]);
        if (!ignore) {
          setUsers(u);
          setJobs(j);
          setApplications(a);
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Failed to load trends");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [period, groupBy]);

  // Load tab lists on demand
  useEffect(() => {
    const controller = new AbortController();
    async function loadJobs() {
      try {
        setJobListLoading(true);
        const res = await getJson<{ jobs: any[] }>(`/api/admin/jobs?page=1&limit=8`, {
          signal: controller.signal,
        } as any);
        setJobList(res?.jobs || []);
      } catch (e) {
        // ignore per-tab error
      } finally {
        setJobListLoading(false);
      }
    }
    async function loadApplications() {
      try {
        setApplicationListLoading(true);
        const res = await getJson<{ applications: any[] }>(
          `/api/admin/applications?page=1&limit=8`,
          {
            signal: controller.signal,
          } as any
        );
        setApplicationList(res?.applications || []);
      } catch (e) {
        // ignore per-tab error
      } finally {
        setApplicationListLoading(false);
      }
    }
    if (tab === "jobs") loadJobs();
    if (tab === "applications") loadApplications();
    return () => controller.abort();
  }, [tab]);

  const userTotal = useMemo(() => {
    const pts = users?.trends?.userCounts || [];
    return pts.length ? pts[pts.length - 1].total || 0 : 0;
  }, [users]);
  const jobTotal = useMemo(
    () => (jobs?.trends?.jobCounts || []).reduce((acc, p) => acc + (p.count || p.total || 0), 0),
    [jobs]
  );
  const appTotal = useMemo(
    () =>
      (applications?.trends?.applicationCounts || []).reduce(
        (acc, p) => acc + (p.count || p.total || 0),
        0
      ),
    [applications]
  );

  const userSeries = useMemo(() => toChartData(users?.trends?.userCounts, "total"), [users]);
  const jobSeries = useMemo(() => toChartData(jobs?.trends?.jobCounts, "total"), [jobs]);
  const appSeries = useMemo(
    () => toChartData(applications?.trends?.applicationCounts, "total"),
    [applications]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="day">By day</option>
              <option value="week">By week</option>
              <option value="month">By month</option>
            </select>
            <button
              className="ml-1 inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setLoading(true);
                setGroupBy((g) => g);
              }}
              title="Refresh"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            label="Total Jobs"
            value={jobTotal}
            sub={jobs ? `${jobs.period} • ${jobs.groupBy}` : undefined}
            icon={<FiBriefcase />}
            accent="bg-indigo-500"
          />
          <StatCard
            label="Total Applications"
            value={appTotal}
            sub={applications ? `${applications.period} • ${applications.groupBy}` : undefined}
            icon={<FiFileText />}
            accent="bg-blue-500"
          />
          <StatCard
            label="Total Users"
            value={userTotal}
            sub={users ? `${users.period} • ${users.groupBy}` : undefined}
            icon={<FiUsers />}
            accent="bg-emerald-500"
          />
          <StatCard
            label="Platform Growth"
            value={<span className="text-emerald-600">Active</span>}
            sub="Platform is running"
            icon={<FiTrendingUp />}
            accent="bg-fuchsia-500"
          />
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-1">
          <div className="flex gap-2 p-1">
            {[
              { id: "overview", label: "Overview" },
              { id: "jobs", label: "Jobs" },
              { id: "applications", label: "Applications" },
              { id: "users", label: "Users" },
            ].map((t: any) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 text-sm rounded-md ${
                  tab === t.id ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "overview" && (
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Job Posting Trends</h2>
                <span className="text-xs text-gray-500">
                  {jobs?.dateRange?.start
                    ? dateFmt.format(new Date(jobs.dateRange.start + "T00:00:00Z"))
                    : ""}{" "}
                  – {jobs?.dateRange?.end ? dateFmt.format(new Date(jobs.dateRange.end + "T00:00:00Z")) : ""}
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={jobSeries} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <defs>
                      <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="url(#colorJobs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Application Trends</h2>
                <span className="text-xs text-gray-500">
                  {applications?.dateRange?.start
                    ? dateFmt.format(new Date(applications.dateRange.start + "T00:00:00Z"))
                    : ""}{" "}
                  –{" "}
                  {applications?.dateRange?.end
                    ? dateFmt.format(new Date(applications.dateRange.end + "T00:00:00Z"))
                    : ""}
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appSeries} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {tab === "users" && (
          <section className="mt-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">User Signups</h2>
                <span className="text-xs text-gray-500">
                  {users?.dateRange?.start
                    ? dateFmt.format(new Date(users.dateRange.start + "T00:00:00Z"))
                    : ""}{" "}
                  –{" "}
                  {users?.dateRange?.end ? dateFmt.format(new Date(users.dateRange.end + "T00:00:00Z")) : ""}
                </span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userSeries} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {tab === "jobs" && (
          <section className="mt-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">All Jobs</h2>
                <span className="text-xs text-gray-500">Latest 8 jobs</span>
              </div>
              {jobListLoading ? (
                <div className="text-sm text-gray-600">Loading jobs…</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobList.map((j: any) => (
                    <div key={j._id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm text-gray-500">
                            {dateFmt.format(new Date(j.createdAt))}
                          </div>
                          <div className="mt-1 font-semibold text-gray-900">{j.title}</div>
                          <div className="text-xs text-gray-600">
                            {j?.createdBy?.name || "Unknown"}
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${j.status === "OPEN" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          {j.status}
                        </span>
                      </div>
                      {j?.location?.city && (
                        <div className="mt-3 text-xs text-gray-600">
                          {j.location.city}
                          {j?.location?.country ? `, ${j.location.country}` : ""}
                        </div>
                      )}
                    </div>
                  ))}
                  {jobList.length === 0 && (
                    <div className="text-sm text-gray-600">No jobs found.</div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "applications" && (
          <section className="mt-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Recent Applications</h2>
                <span className="text-xs text-gray-500">Latest 8 applications</span>
              </div>
              {applicationListLoading ? (
                <div className="text-sm text-gray-600">Loading applications…</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {applicationList.map((a: any) => (
                    <div key={a._id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm text-gray-500">
                            {dateFmt.format(new Date(a.createdAt))}
                          </div>
                          <div className="mt-1 font-semibold text-gray-900">
                            {a?.jobId?.title || "Job"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {a?.userId?.name || "Applicant"}
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${a.status === "shortlisted" ? "bg-amber-50 text-amber-700" : a.status === "rejected" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}
                        >
                          {a.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {applicationList.length === 0 && (
                    <div className="text-sm text-gray-600">No applications found.</div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {loading && <div className="mt-8 text-sm text-gray-600">Loading data…</div>}
      </main>
    </div>
  );
}
