import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8fc] text-slate-950">
      <section className="relative isolate min-h-180 border-b border-slate-200">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_18%,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_15%_80%,rgba(14,165,233,0.12),transparent_25%)]" />
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="WittyBoard logo" width={42} height={34} />
            <span className="text-xl font-bold tracking-tight">WittyBoard</span>
          </Link>
          {/* Auth links carry users straight to the dashboard after Clerk completes the flow. */}
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link href="/sign-in?redirect_url=/dashboard" className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-white hover:text-slate-950">Sign in</Link>
            <Link href="/sign-up?redirect_url=/dashboard" className="rounded-full bg-slate-950 px-4 py-2 text-white shadow-lg shadow-slate-950/15 transition hover:bg-indigo-700">Create account</Link>
          </div>
        </nav>
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-28 lg:pt-20">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 shadow-sm"><span className="size-2 rounded-full bg-emerald-500" /> Think together. Build clearly.</p>
            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.04em] text-slate-950 sm:text-7xl">Turn scattered ideas into a board everyone can see.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">WittyBoard brings sketches, structured notes, emojis, and SmartWitty AI into one focused space for planning what comes next.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/sign-up?redirect_url=/dashboard" className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700">Start for free</Link>
              <Link href="/sign-in?redirect_url=/dashboard" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-500 hover:text-slate-950">Sign in to your boards</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500"><span>10 workspaces included</span><span>Autosaved boards</span><span>AI-assisted diagrams</span></div>
          </div>
          {/* This preview is intentionally above the fold so visitors immediately see the product. */}
          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-indigo-400/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white bg-white p-3 shadow-2xl shadow-indigo-950/15">
              <div className="flex items-center gap-2 border-b border-slate-100 px-3 pb-3"><span className="size-2.5 rounded-full bg-rose-400" /><span className="size-2.5 rounded-full bg-amber-400" /><span className="size-2.5 rounded-full bg-emerald-400" /><span className="ml-3 text-xs font-semibold text-slate-400">Product launch map</span></div>
              <div className="relative mt-3 aspect-[1.35] overflow-hidden rounded-xl bg-slate-100">
                <Image src="/image.png" alt="WittyBoard whiteboard preview" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-tr from-slate-950/20 via-transparent to-white/20" />
                <div className="absolute left-[10%] top-[18%] rounded-lg bg-white/90 px-4 py-3 text-xs font-bold text-indigo-700 shadow-lg">Shape the idea</div>
                <div className="absolute right-[12%] top-[42%] rounded-lg bg-amber-100/95 px-4 py-3 text-xs font-bold text-amber-900 shadow-lg">Make it visible</div>
                <div className="absolute bottom-[16%] left-[22%] rounded-lg bg-emerald-100/95 px-4 py-3 text-xs font-bold text-emerald-900 shadow-lg">Move together</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* These three steps explain the primary workflow without distracting from the auth CTA. */}
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-16 sm:grid-cols-3 lg:px-10">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-indigo-600">01 / Capture</p><h2 className="mt-3 text-xl font-bold">Start with a blank canvas</h2><p className="mt-2 text-sm leading-6 text-slate-500">Sketch flows, drop in notes, and build a visual language that fits the way your team thinks.</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-emerald-600">02 / Shape</p><h2 className="mt-3 text-xl font-bold">Let SmartWitty help</h2><p className="mt-2 text-sm leading-6 text-slate-500">Turn a rough description into a useful diagram, flowchart, wireframe, or architecture map.</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-amber-600">03 / Return</p><h2 className="mt-3 text-xl font-bold">Your work stays yours</h2><p className="mt-2 text-sm leading-6 text-slate-500">Boards autosave, survive reloads, and remain available from your workspace library.</p></article>
      </section>
    </main>
  );
}
