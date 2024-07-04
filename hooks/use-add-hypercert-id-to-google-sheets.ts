import { useMutation } from "@tanstack/react-query";

type Payload = { hypercertId: string };

const useAddHypercertIdToGoogleSheet = () => {
	return useMutation({
		mutationFn: (payload: Payload) =>
			fetch("/api/post-hypercert-id", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(payload),
			}),
	});
};

export { useAddHypercertIdToGoogleSheet };
