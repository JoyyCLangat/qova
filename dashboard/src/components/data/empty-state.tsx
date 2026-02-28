import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
}

export function EmptyState({
	icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps): React.ReactElement {
	return (
		<div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
			<div className="mb-4 text-[var(--muted-foreground)]">{icon}</div>
			<h3 className="font-heading text-lg font-semibold text-[var(--foreground)]">{title}</h3>
			<p className="mt-1 max-w-sm text-sm text-[var(--muted-foreground)]">{description}</p>
			{action && (
				<button
					type="button"
					onClick={action.onClick}
					className={cn(
						"mt-6 inline-flex items-center rounded-lg px-4 py-2",
						"border border-[var(--border)] bg-[var(--primary)]",
						"text-sm font-medium text-[var(--primary-foreground)]",
						"hover:opacity-90 transition-opacity cursor-pointer",
					)}
				>
					{action.label}
				</button>
			)}
		</div>
	);
}
