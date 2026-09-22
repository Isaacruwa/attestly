"use client";

import { useRouter } from "next/navigation";

type OrgOption = {
  id: string;
  name: string;
};

// Lets an account that belongs to more than one organization (e.g. an
// agency managing several clients) switch which workspace's AI systems
// the dashboard is showing. Purely additive: accounts with a single org
// never see this (see DashboardPage, which only renders it when
// orgs.length > 1), so nothing changes for the common single-org case.
export default function OrgSwitcher({
  orgs,
  currentOrgId,
}: {
  orgs: OrgOption[];
  currentOrgId: string | null;
}) {
  const router = useRouter();

  return (
    <select
      value={currentOrgId ?? "__all__"}
      onChange={(e) => {
        const value = e.target.value;
        if (value === "__all__") {
          router.push("/dashboard");
        } else {
          router.push(`/dashboard?org=${value}`);
        }
      }}
      style={{
        padding: "6px 10px",
        borderRadius: 4,
        border: "1px solid var(--color-line)",
        fontSize: 13,
        fontFamily: "inherit",
        background: "white",
      }}
    >
      <option value="__all__">All client workspaces</option>
      {orgs.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name}
        </option>
      ))}
    </select>
  );
}
