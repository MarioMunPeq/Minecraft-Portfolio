interface GrimoirePageProps {
  children: React.ReactNode;
  side: 'left' | 'right';
}

export function GrimoirePage({ children, side }: GrimoirePageProps) {
  return (
    <div className={`mc-grimoire-page ${side}`}>
      <div className="mc-page-content">
        {children}
      </div>
      <div className={`mc-page-edge ${side}`} />
    </div>
  );
}