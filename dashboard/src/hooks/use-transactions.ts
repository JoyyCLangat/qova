"use client";

import { useEffect, useState } from "react";
import type { TxStatsResponse } from "@/lib/api";
import { api } from "@/lib/api";
import { getSeedTxStats } from "@/lib/seed-data";

export function useTransactions(address: string): {
	data: TxStatsResponse | null;
	loading: boolean;
	error: string | null;
	isDemo: boolean;
} {
	const [data, setData] = useState<TxStatsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, _setError] = useState<string | null>(null);
	const [isDemo, setIsDemo] = useState(false);

	useEffect(() => {
		if (!address) {
			setLoading(false);
			return;
		}

		api
			.getTxStats(address)
			.then((res) => {
				setData(res);
			})
			.catch(() => {
				setData(getSeedTxStats(address));
				setIsDemo(true);
			})
			.finally(() => setLoading(false));
	}, [address]);

	return { data, loading, error, isDemo };
}
