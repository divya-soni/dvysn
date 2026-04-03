export default function Tag({ children }: { children: string }) {
  return (
    <span className="font-mono text-[12px] text-muted border border-line px-2 h-6 flex items-center">
      {children}
    </span>
  );
}
