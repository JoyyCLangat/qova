"use client";

import { Check, Desktop, Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
	{ value: "light", label: "Light", Icon: Sun },
	{ value: "dark", label: "Dark", Icon: Moon },
	{ value: "system", label: "System", Icon: Desktop },
] as const;

function getActiveIcon(theme: string | undefined): typeof Sun {
	if (theme === "light") return Sun;
	if (theme === "dark") return Moon;
	return Desktop;
}

export function ThemeToggle(): React.ReactElement | null {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!open) return;

		function handleClickOutside(event: MouseEvent): void {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return (): void => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	if (!mounted) return null;

	const ActiveIcon = getActiveIcon(theme);

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className={cn(
					"inline-flex h-9 w-9 items-center justify-center rounded-md",
					"border border-[var(--border)] bg-transparent",
					"text-[var(--foreground)] hover:bg-[var(--accent)]",
					"cursor-pointer transition-colors",
				)}
				aria-label="Toggle theme"
			>
				<ActiveIcon size={16} />
			</button>

			{open && (
				<div
					className={cn(
						"absolute right-0 top-full z-50 mt-2 w-36",
						"rounded-lg border border-[var(--border)] bg-[var(--popover)] p-1",
					)}
				>
					{THEME_OPTIONS.map(({ value, label, Icon }) => (
						<button
							key={value}
							type="button"
							onClick={() => {
								setTheme(value);
								setOpen(false);
							}}
							className={cn(
								"flex w-full items-center gap-2 rounded-md px-3 py-2",
								"cursor-pointer text-sm text-[var(--foreground)]",
								"hover:bg-[var(--accent)] transition-colors",
							)}
						>
							<Icon size={14} />
							<span className="flex-1 text-left">{label}</span>
							{theme === value && (
								<Check size={14} className="text-[var(--muted-foreground)]" />
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
