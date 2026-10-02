export default function ShopLoading() {
  return (
    <div aria-busy="true" aria-label="Loading perfumes">
      <div className="bg-basil-dark">
        <div className="shell py-14 md:py-20">
          <div className="h-3 w-40 rounded bg-ivory/15" />
          <div className="mt-6 h-14 w-72 rounded bg-ivory/15" />
          <div className="mt-4 h-4 w-96 max-w-full rounded bg-ivory/10" />
        </div>
      </div>
      <div className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-[250px_1fr] xl:gap-14">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton h-5 rounded" style={{ width: `${60 + ((i * 13) % 35)}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i}>
              <div className="skeleton aspect-[4/5] rounded-[3px]" />
              <div className="skeleton mt-4 h-3 w-1/2 rounded" />
              <div className="skeleton mt-3 h-5 w-3/4 rounded" />
              <div className="skeleton mt-3 h-4 w-1/3 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
