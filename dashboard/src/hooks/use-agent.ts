"use client";

import { useEffect, useState } from "react";
import type { AgentDetailsResponse } from "@/lib/api";
import { api } from "@/lib/api";
import { SEED_AGENTS } from "@/lib/seed-data";

export function useAgent(address: string): {
	data: AgentDetailsResponse | null;
	loading: boolean;
	error: string | null;
	isDemo: boolean;
} {
	const [data, setData] = useState<AgentDetailsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, _setError] = useState<string | null>(null);
	const [isDemo, setIsDemo] = useState(false);

	useEffect(() => {
		if (!address) {
			setLoading(false);
			return;
		}

		api
			.getAgent(address)
			.then((res) => {
				setData(res);
			})
			.catch(() => {
				const seed = SEED_AGENTS.find((a) => a.agent === address) ?? SEED_AGENTS[0];
				setData(seed);
				setIsDemo(true);
			})
			.finally(() => setLoading(false));
	}, [address]);

	return { data, loading, error, isDemo };
}
