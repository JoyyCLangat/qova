"use client";

import { useEffect, useState } from "react";
import type { AgentDetailsResponse } from "@/lib/api";
import { api } from "@/lib/api";
import { SEED_AGENTS } from "@/lib/seed-data";

export function useAgents(): {
	data: AgentDetailsResponse[] | null;
	loading: boolean;
	error: string | null;
	isDemo: boolean;
} {
	const [data, setData] = useState<AgentDetailsResponse[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, _setError] = useState<string | null>(null);
	const [isDemo, setIsDemo] = useState(false);

	useEffect(() => {
		api
			.getAgents()
			.then(async (res) => {
				if (res.agents?.length > 0) {
					const details = await Promise.all(
						res.agents.map((addr) => api.getAgent(addr).catch(() => null)),
					);
					const valid = details.filter((d): d is AgentDetailsResponse => d !== null);
					if (valid.length > 0) {
						setData(valid);
					} else {
						setData(SEED_AGENTS);
						setIsDemo(true);
					}
				} else {
					setData(SEED_AGENTS);
					setIsDemo(true);
				}
			})
			.catch(() => {
				setData(SEED_AGENTS);
				setIsDemo(true);
			})
			.finally(() => setLoading(false));
	}, []);

	return { data, loading, error, isDemo };
}
