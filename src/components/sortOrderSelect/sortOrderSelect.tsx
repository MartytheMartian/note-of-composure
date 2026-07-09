import type { ListSortOrder } from '../../state/types';

interface SortOrderSelectProps {
  value: ListSortOrder;
  onChange: (order: ListSortOrder) => void;
  categoryLabel: string;
}

export default function (p: SortOrderSelectProps) {
  return (
    <select className="select-control" value={p.value} onChange={(e) => p.onChange(e.target.value as ListSortOrder)}>
      <option value="root">Sort by Root</option>
      <option value="category">Sort by {p.categoryLabel}</option>
    </select>
  );
}
