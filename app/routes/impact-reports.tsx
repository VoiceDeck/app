import { fetchReports } from "~/server/impactReportHelpers";

export const loader = async () => {
	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	try {
		if (!ownerAddress) {
			throw new Error("Owner address environment variable is not set");
		}
		const reports = await fetchReports(ownerAddress);
		return new Response(JSON.stringify(reports), {
			status: 200,
			statusText: "OK",
		});
	} catch (error) {
		console.error(`Failed to load impact reports: ${error}`);
		return new Response(
			JSON.stringify({ error: "Failed to load impact reports" }),
			{
				status: 500,
				statusText: "Internal Server Error",
			},
		);
	}
};

// or you can use loader like this and import it in the route file:
// export const loader = async (): Promise<IReportLoader> => {
//  const ownerAddress = process.env.HC_OWNER_ADDRESS;
// 	return { reports: await fetchReports(ownerAddress) };
// };
//
//
// and then retrive the data like this in `Index()` function:
// export default function Index() {
//   const { reports } = useLoaderData<typeof loader>();
//   ...
// }
