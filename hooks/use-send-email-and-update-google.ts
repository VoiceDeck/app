import { sendEmailAndUpdateGoogle } from "@/lib/sendEmailAndUpdateGoogle";
import { useMutation } from "@tanstack/react-query";

type Payload = { hypercertId: string; contactInfo: string; image?: string };

const useSendEmailAndUpdateGoogle = () => {
	return useMutation({
		mutationFn: (payload: Payload) => sendEmailAndUpdateGoogle(payload),
	});
};

export { useSendEmailAndUpdateGoogle };
