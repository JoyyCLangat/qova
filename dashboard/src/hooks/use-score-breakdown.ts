"use client";

import { useEffect, useState } from "react";
import type { ScoreBreakdownResponse } from "@/lib/api";
import { api } from "@/lib/api";
import { getSeedBreakdown } from "@/lib/seed-data";

export function useScoreBreakdown(address: string): {
	data: ScoreBreakdownResponse | null;
	loading: boolean;
	error: string | null;
	isDemo: boolean;
} {
	const [data, setData] = useState<ScoreBreakdownResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, _setError] = useState<string | null>(null);
	const [isDemo, setIsDemo] = useState(false);

	useEffect(() => {
		if (!address) {
			setLoading(false);
			return;
		}

		api
			.getScoreBreakdown(address)
			.then((res) => {
				setData(res);
			})
			.catch(() => {
				setData(getSeedBreakdown(address));
				setIsDemo(true);
			})
			.finally(() => setLoading(false));
	}, [address]);

	return { data, loading, error, isDemo };
}
