interface CharactersTableSkeletonProps {
  rows?: number;
  withPagination?: boolean;
}

export function CharactersTableSkeleton({
  rows = 20,
  withPagination = false,
}: CharactersTableSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[150] table-fixed" aria-hidden="true">
            <thead className="border-border border-b bg-surface">
              <tr>
                <th className="w-30 px-4 py-3 text-left font-semibold text-sm text-text">Image</th>
                <th className="w-50 px-4 py-3 text-left font-semibold text-sm text-text">Name</th>
                <th className="w-40 px-4 py-3 text-left font-semibold text-sm text-text">Status</th>
                <th className="w-40 px-4 py-3 text-left font-semibold text-sm text-text">
                  Species
                </th>
                <th className="w-30 px-4 py-3 text-left font-semibold text-sm text-text">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {Array.from({ length: rows }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <array is static>
                <CharacterRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {withPagination && <PaginationSkeleton />}
    </div>
  );
}

export function CharacterRowSkeleton() {
  return (
    <tr className="h-24">
      <td className="w-30 px-4 py-3 align-middle">
        <div className="h-20 w-20 animate-pulse rounded-md bg-border" />
      </td>

      <td className="w-50 px-4 py-3 align-middle">
        <div className="h-4 w-32 animate-pulse rounded bg-border" />
      </td>

      <td className="w-40 px-4 py-3 align-middle">
        <div className="h-4 w-24 animate-pulse rounded bg-border" />
      </td>

      <td className="w-40 px-4 py-3 align-middle">
        <div className="h-4 w-20 animate-pulse rounded bg-border" />
      </td>
      <td className="w-30 px-4 py-3 align-middle">
        <ActionButtonSkeleton />
      </td>
    </tr>
  );
}

export function ActionButtonSkeleton() {
  return <div className="h-5 w-15 animate-pulse rounded-md bg-border" />;
}

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="h-9 w-24 animate-pulse rounded bg-border" />
      <div className="h-4 w-40 animate-pulse rounded bg-border" />
      <div className="h-9 w-24 animate-pulse rounded bg-border" />
    </div>
  );
}
