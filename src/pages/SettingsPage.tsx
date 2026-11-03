import { BellRing, Globe2, ShieldCheck, UserRound } from "lucide-react";
import { PageHeading } from "../components/ui/PageHeading";

const settings = [
  { icon: UserRound, title: "Profile", description: "Manage your name and account preferences.", detail: "Jordan Davis" },
  { icon: Globe2, title: "Environment", description: "Default AWS region used for this workspace.", detail: "us-east-1" },
  { icon: BellRing, title: "Notifications", description: "Choose how you receive service and deployment updates.", detail: "Email and in-app" },
  { icon: ShieldCheck, title: "Security", description: "Review sign-in and access settings.", detail: "Multi-factor enabled" },
];

export function SettingsPage() {
  return (
    <>
      <PageHeading eyebrow="PREFERENCES" title="Settings" description="Manage your workspace preferences and notifications." />
      <div className="max-w-3xl space-y-3">
        {settings.map(({ icon: Icon, title, description, detail }) => (
          <section className="panel-card flex flex-wrap items-center justify-between gap-4 p-5" key={title}>
            <div className="flex items-center gap-3.5">
              <span className="rounded-lg bg-slate-50 p-2.5 text-slate-600"><Icon className="size-[17px]" aria-hidden="true" /></span>
              <div><h2 className="text-sm font-semibold text-slate-800">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>
            </div>
            <button type="button" className="button-secondary">{detail}</button>
          </section>
        ))}
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">This is a mock dashboard. Settings are examples only and are not connected to an AWS account.</p>
      </div>
    </>
  );
}
