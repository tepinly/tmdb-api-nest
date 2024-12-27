export function getPagination(args: { page: number; limit: number }) {
  const offset = (args.page - 1) * args.limit;
  return {
    page: offset,
    limit: args.limit,
  };
}
