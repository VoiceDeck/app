const sendEmailAndUpdateGoogle = async ({
	hypercertId,
	contactInfo,
	image,
}: { hypercertId: string; contactInfo: string; image?: string }) => {
	if (!hypercertId || !contactInfo) {
		throw new Error("Missing hypercertId or contactInfo");
	}
	try {
		const googleSheetsData = {
			hypercertId,
		};

		const emailData = {
			hypercertId,
			contactInfo,
			image,
		};

		const googleSheetsResponse = await fetch("/api/post-hypercert-id", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(googleSheetsData),
		});

		if (!googleSheetsResponse.ok) {
			throw new Error(
				`Error with first request: ${googleSheetsResponse.statusText}`,
			);
		}

		const googleSheetsResult = await googleSheetsResponse.json();
		console.log("First POST response:", googleSheetsResult);

		const emailResponse = await fetch("/api/send-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(emailData),
		});

		if (!emailResponse.ok) {
			throw new Error(`Error with second request: ${emailResponse.statusText}`);
		}

		const emailResults = await emailResponse.json();
		if (emailResults.success && googleSheetsResult.success) {
			return { success: true };
		}
	} catch (error) {
		console.error("Error sending POST requests:", error);
		return { error };
	}
};

export { sendEmailAndUpdateGoogle };
