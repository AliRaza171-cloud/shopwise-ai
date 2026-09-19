import Link from "next/link";
import { LucideIcon } from "lucide-react";

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  comingSoon,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}) {
  return (
    <Link
      href={comingSoon ? "#" : href}
      className={`block bg-card border border-ink/10 rounded-sm p-6 transition-all ${
        comingSoon
          ? "opacity-60 cursor-default"
          : "hover:border-teal hover:shadow-[2px_3px_0_rgba(27,36,32,0.06)]"
      }`}
      onClick={(e) => comingSoon && e.preventDefault()}
    >
      <Icon size={22} className="text-teal mb-3.5" strokeWidth={1.75} />
      <h3 className="font-semibold text-[15px] mb-1.5 flex items-center gap-2">
        {title}
        {comingSoon && (
          <span className="font-mono text-[10px] text-ink-soft bg-paper-dim px-2 py-0.5 rounded-full">
            coming soon
          </span>
        )}
      </h3>
      <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
    </Link>
  );
}
