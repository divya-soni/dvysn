export default function MetadataList({
  items,
}: {
  items: Array<{ label: string; value: string | number }>;
}) {
  return (
    <dl className="metadata-list">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
