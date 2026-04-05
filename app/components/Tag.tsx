export default function Tag({ children }: { children: string }) {
  return (
    <span className="font-mono text-[12px] text-muted border border-line px-2.5 h-7 flex items-center hover:text-foreground hover:border-muted transition-colors duration-150">
      {children}
    </span>
  );
}
