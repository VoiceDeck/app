import { useQuery } from "@tanstack/react-query";

const useAddHypercertIdToGoogleSheet = (hypercertId: string | undefined) => {
	return useQuery({
		queryKey: ["hypercertId", { hypercertId }],
		queryFn: () =>
			fetch("/api/post-hypercert-id", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify({ hypercertId }),
			}),
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !!hypercertId,
	});
};

export { useAddHypercertIdToGoogleSheet };
