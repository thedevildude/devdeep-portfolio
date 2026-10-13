const STATS = [
  { label: "Records", value: "128", hint: "encrypted" },
  { label: "Shared", value: "14", hint: "active grants" },
  { label: "Pinned", value: "3.2 GB", hint: "on IPFS" },
] as const;

const PIPELINE = [
  { label: "Patient", sub: "uploads file" },
  { label: "AES-256", sub: "client-side" },
  { label: "IPFS", sub: "Qm9x…4fT2" },
  { label: "Contract", sub: "grants key" },
] as const;

const ACTIVITY = [
  {
    who: "City General",
    action: "requested access",
    time: "now",
    tone: "bg-amber-400",
    live: true,
  },
  {
    who: "Dr. A. Rao",
    action: "viewed Blood panel",
    time: "2m",
    tone: "bg-sky-400",
  },
  {
    who: "You",
    action: "granted Prescription",
    time: "9m",
    tone: "bg-emerald-400",
  },
  {
    who: "Lab 12",
    action: "uploaded MRI scan",
    time: "1h",
    tone: "bg-violet-400",
  },
] as const;

const NAV = ["Vault", "Access", "Audit", "Keys"] as const;

/** Decorative HTML/CSS mock of the dApp dashboard; hidden from assistive tech. */
const DoctorWeb3Mock = () => (
  <div
    aria-hidden
    className="absolute inset-0 flex items-center justify-center overflow-hidden bg-linear-to-br from-white/5 to-white/0 p-4 sm:p-6"
  >
    <div className="absolute -top-16 -right-16 size-64 rounded-full bg-sky-400/20 blur-3xl" />
    <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-violet-500/20 blur-3xl" />

    <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-black/35 text-[11px] ring-1 ring-white/15 backdrop-blur sm:text-xs">
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-white/10 px-3 py-2">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/25" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-white/10 px-2 py-0.5 text-center font-mono opacity-70">
          doctorweb3.app/vault
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 font-mono">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          0x7a3f…c2e9
        </span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <nav className="hidden w-24 shrink-0 flex-col gap-1 border-r border-white/10 p-2 sm:flex">
          {NAV.map((item, i) => (
            <span
              key={item}
              className={`rounded-md px-2.5 py-1.5 font-semibold ${i === 0 ? "bg-white/15" : "opacity-55"}`}
            >
              {item}
            </span>
          ))}
          <span className="mt-auto rounded-md bg-white/10 px-2 py-1.5 font-mono text-[10px] opacity-70">
            Sepolia · #19.4M
          </span>
        </nav>

        <div className="min-w-0 flex-1 space-y-3 p-3">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-lg bg-white/10 px-2.5 py-2">
                <span className="block opacity-60">{s.label}</span>
                <span className="block text-base font-semibold sm:text-lg">
                  {s.value}
                </span>
                <span className="block text-[10px] opacity-50">{s.hint}</span>
              </div>
            ))}
          </div>

          {/* Pipeline: a pulse travels along the dashed line */}
          <div className="rounded-lg bg-white/5 px-3 py-3 ring-1 ring-white/10">
            <span className="mb-3 block font-semibold uppercase opacity-60">
              Upload pipeline
            </span>
            <div className="relative">
              <div className="absolute top-3 right-4 left-4 border-t border-dashed border-white/30" />
              <span className="dw3-pulse absolute top-[9px] left-4 size-1.5 rounded-full bg-sky-300 shadow-[0_0_10px_2px] shadow-sky-400/70" />
              <ol className="relative grid grid-cols-4 gap-1 text-center">
                {PIPELINE.map((step, i) => (
                  <li key={step.label} className="flex flex-col items-center">
                    <span className="grid size-6 place-items-center rounded-full bg-[#17224a] font-mono text-[10px] ring-1 ring-white/40">
                      {i + 1}
                    </span>
                    <span className="mt-1.5 font-semibold">{step.label}</span>
                    <span className="max-w-full truncate font-mono text-[10px] opacity-55">
                      {step.sub}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-lg bg-white/5 ring-1 ring-white/10">
            <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
              <span className="font-semibold uppercase opacity-60">
                Access log
              </span>
              <span className="font-mono text-[10px] opacity-50">on-chain</span>
            </div>
            <ul className="divide-y divide-white/10">
              {ACTIVITY.map((a) => (
                <li
                  key={a.who + a.action}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${a.tone} ${"live" in a ? "dw3-blink" : ""}`}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-semibold">{a.who}</span>{" "}
                    <span className="opacity-65">{a.action}</span>
                  </span>
                  {"live" in a ? (
                    <span className="flex shrink-0 gap-1">
                      <span className="rounded bg-sky-400 px-1.5 py-0.5 font-semibold text-slate-900">
                        Approve
                      </span>
                      <span className="rounded bg-white/15 px-1.5 py-0.5">
                        Deny
                      </span>
                    </span>
                  ) : (
                    <span className="shrink-0 font-mono opacity-50">
                      {a.time}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DoctorWeb3Mock;
