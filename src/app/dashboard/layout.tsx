import type { Metadata } from "next";

// Belt-and-suspenders: robots.txt already disallows /dashboard, but a meta
// robots tag survives even if a crawler ignores robots.txt or a page was
// indexed before the disallow rule existed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
