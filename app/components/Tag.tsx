export default function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full border border-line bg-surface px-2.5 text-[12px] font-medium text-muted transition-colors duration-150 hover:border-primary/40 hover:text-foreground">
      {children}
    </span>
  );
}
