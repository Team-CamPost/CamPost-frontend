import { useEffect, useState } from "react";

type CrawlJob = {
  id: number;
  sourceId: number;
  status: string;
  newCount: number;
  skipCount: number;
  failCount: number;
};

type Notice = {
  id: number;
  articleId: string;
  title: string;
  author: string | null;
  category: string | null;
  date: string | null;
  views: number | null;
  sourceUrl: string | null;
  deadline: string | null;
  target: string | null;
  applyMethod: string | null;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

const JOBS_API_URL = "http://localhost:8080/api/v1/collect/jobs?limit=10";
const NOTICES_API_URL = "http://localhost:8080/api/v1/notices?limit=12";

async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.isSuccess) {
    throw new Error(`${payload.code}: ${payload.message}`);
  }
  return payload.result;
}

function App() {
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [jobData, noticeData] = await Promise.all([
          fetchApi<CrawlJob[]>(JOBS_API_URL),
          fetchApi<Notice[]>(NOTICES_API_URL),
        ]);

        if (!active) return;
        setJobs(jobData);
        setNotices(noticeData);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <header className="mb-8">
          <p className="mb-2 inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-300">
            CAMPOST LIVE API CHECK
          </p>
          <h1 className="text-3xl font-bold sm:text-5xl">
            최근 크롤링 작업 상태
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Jobs API: {JOBS_API_URL}
            <br />
            Notices API: {NOTICES_API_URL}
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-300">
            데이터를 불러오는 중입니다...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-6 text-rose-200">
            API 호출 실패: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Job ID</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">New</th>
                    <th className="px-4 py-3">Skipped</th>
                    <th className="px-4 py-3">Failed</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-t border-slate-800"
                    >
                      <td className="px-4 py-3">{job.id}</td>
                      <td className="px-4 py-3">{job.sourceId}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            job.status === "success"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{job.newCount}</td>
                      <td className="px-4 py-3">{job.skipCount}</td>
                      <td className="px-4 py-3">{job.failCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <section>
              <h2 className="mb-4 text-xl font-semibold">공지 카드 미리보기</h2>

              {notices.length === 0 ? (
                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-300">
                  notices 테이블에 데이터가 아직 없습니다. Importer 연동 후
                  카드가 채워집니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {notices.map((notice) => (
                    <article
                      key={notice.id}
                      className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
                    >
                      <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                        <span>{notice.category || "미분류"}</span>
                        <span>조회 {notice.views ?? 0}</span>
                      </div>

                      <h3 className="line-clamp-2 min-h-12 text-base leading-6 font-semibold text-slate-100">
                        {notice.title}
                      </h3>

                      <p className="mt-2 text-xs text-slate-400">
                        작성자 {notice.author || "-"} | 작성일{" "}
                        {notice.date || "-"}
                      </p>

                      <div className="mt-4 space-y-1 text-xs text-slate-300">
                        <p>마감: {notice.deadline || "정보 없음"}</p>
                        <p className="line-clamp-1">
                          대상: {notice.target || "정보 없음"}
                        </p>
                      </div>

                      {notice.sourceUrl && (
                        <a
                          className="mt-4 inline-flex rounded-lg bg-cyan-500/20 px-3 py-2 text-xs font-semibold text-cyan-200"
                          href={notice.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          원문 보기
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
