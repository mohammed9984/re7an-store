export default function ProductLoading() {
  return (
    <div className="shell pb-16 pt-6 md:pt-10" aria-busy="true" aria-label="Loading perfume">
      <div className="skeleton h-3 w-64 rounded" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.08fr_1fr] lg:gap-16 xl:gap-20">
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <div className="flex gap-3 md:w-20 md:flex-col">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton aspect-[4/5] w-16 rounded-[3px] md:w-full" />
            ))}
          </div>
          <div className="skeleton aspect-[4/5] flex-1 rounded-[3px]" />
        </div>
        <div>
          <div className="skeleton h-3 w-28 rounded" />
          <div className="skeleton mt-4 h-14 w-3/4 rounded" />
          <div className="skeleton mt-3 h-6 w-40 rounded" />
          <div className="skeleton mt-8 h-8 w-full rounded" />
          <div className="skeleton mt-8 h-10 w-36 rounded" />
          <div className="mt-8 flex gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-16 w-28 rounded" />
            ))}
          </div>
          <div className="skeleton mt-8 h-14 w-full rounded" />
          <div className="skeleton mt-3 h-14 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
