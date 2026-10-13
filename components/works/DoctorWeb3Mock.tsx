const RECORDS = [
  {
    name: "Blood panel",
    cid: "Qm9x…4fT2",
    status: "Shared",
    tone: "bg-emerald-400",
  },
  {
    name: "MRI scan",
    cid: "QmVa…7kLp",
    status: "Encrypted",
    tone: "bg-sky-400",
  },
  {
    name: "Prescription",
    cid: "QmTe…c91Z",
    status: "Shared",
    tone: "bg-emerald-400",
  },
  {
    name: "Discharge note",
    cid: "QmRw…2dQa",
    status: "Pending",
    tone: "bg-amber-400",
  },
] as const;

/** Decorative HTML/CSS mock of the records vault; hidden from assistive tech. */
const DoctorWeb3Mock = () => (
  <div
    aria-hidden
    className="absolute inset-0 flex items-center justify-center overflow-hidden bg-linear-to-br from-white/5 to-white/0 p-5 sm:p-8"
  >
    <div className="absolute -top-16 -right-16 size-64 rounded-full bg-sky-400/20 blur-3xl" />
    <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-violet-500/20 blur-3xl" />

    <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-black/30 text-xs ring-1 ring-white/15 backdrop-blur sm:text-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-semibold uppercase">Records vault</span>
        <span className="flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-[11px]">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          0x7a3f…c2e9
        </span>
      </div>

      <ul className="divide-y divide-white/10">
        {RECORDS.map((r) => (
          <li key={r.name} className="flex items-center gap-3 px-4 py-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10">
              <span className="size-3 rounded-sm border border-current opacity-70" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{r.name}</span>
              <span className="block truncate font-mono text-[11px] opacity-60">
                ipfs://{r.cid}
              </span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[11px]">
              <span className={`size-1.5 rounded-full ${r.tone}`} />
              {r.status}
            </span>
          </li>
        ))}
      </ul>

      <div className="m-3 flex items-center justify-between gap-3 rounded-xl bg-white/10 px-3 py-2.5">
        <span className="min-w-0">
          <span className="block text-[11px] uppercase opacity-60">
            Access granted · tx
          </span>
          <span className="block truncate font-mono text-[11px]">
            0x91d4…b7a0 · block 19,482,031
          </span>
        </span>
        <span className="shrink-0 rounded-md bg-sky-400 px-3 py-1.5 text-[11px] font-semibold text-slate-900">
          Revoke
        </span>
      </div>
    </div>
  </div>
);

export default DoctorWeb3Mock;
