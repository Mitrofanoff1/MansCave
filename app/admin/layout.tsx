import type { Metadata } from 'next';

// Админка не должна индексироваться поисковиками.
export const metadata: Metadata = {
  title: 'Админка — Men’s Cave',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
