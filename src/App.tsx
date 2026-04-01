function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-300">
          CAMPOST FRONTEND
        </p>
        <h1 className="text-4xl leading-tight font-bold sm:text-6xl">
          Tailwind 적용 테스트 화면
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
          이 화면이 스타일된 상태로 보이면 Tailwind 설정이 정상입니다.
        </p>
        <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-xs text-slate-400">Step 1</p>
            <p className="mt-2 font-semibold">Project Settings</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-xs text-slate-400">Step 2</p>
            <p className="mt-2 font-semibold">Prettier + Tailwind</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-xs text-slate-400">Step 3</p>
            <p className="mt-2 font-semibold">Ready to Build</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
