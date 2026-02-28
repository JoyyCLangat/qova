import { CheckCircle } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

type StatusType = "active" | "inactive" | "pending" | "verified" | "unverified";

interface StatusBadgeProps {
	status: StatusType;
}

const statusConfig: Record<
	StatusType,
	{ label: string; dotClass: string; textClass: string; showCheck?: boolean }
> = {
	active: {
		label: "Active",
		dotClass: "bg-[var(--score-green)]",
		textClass: "text-[var(--score-green)]",
	},
	inactive: {
		label: "Inactive",
		dotClass: "bg-[var(--muted-foreground)]",
		textClass: "text-[var(--muted-foreground)]",
	},
	pending: {
		label: "Pending",
		dotClass: "bg-[var(--score-yellow)]",
		textClass: "text-[var(--score-yellow)]",
	},
	verified: {
		label: "Verified",
		dotClass: "bg-[var(--score-green)]",
		textClass: "text-[var(--score-green)]",
		showCheck: true,
	},
	unverified: {
		label: "Unverified",
		dotClass: "bg-[var(--score-red)]",
		textClass: "text-[var(--score-red)]",
	},
};

export function StatusBadge({ status }: StatusBadgeProps): React.ReactElement {
	const config = statusConfig[status];

	return (
		<span className="inline-flex items-center gap-1.5">
			{config.showCheck ? (
				<CheckCircle size={14} weight="fill" className={config.textClass} />
			) : (
				<span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
			)}
			<span className={cn("text-xs font-medium", config.textClass)}>{config.label}</span>
		</span>
	);
}
