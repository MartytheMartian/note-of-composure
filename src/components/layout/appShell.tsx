import type { ReactNode } from 'react';
import Header from './header';

type AppShellProps = {
  children: ReactNode;
};

export default function (p: AppShellProps) {
  return (
    <div className="app-shell">
      <Header />
      <main className="detail-pane">{p.children}</main>
    </div>
  );
}
