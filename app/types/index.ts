/**
 * Represents 1 Impact report
 * @property {string} id - The ID of associated hypercert
 * @property {string} title - The title of the report
 * @property {string} summary - The summary of the report
 * @property {string} image - The image of the report
 * @property {string} state - The state where the impact is being made
 * @property {string} category - The category of the report
 * @property {number} totalCost - The total cost of the report in USD
 * @property {number} fundedSoFar - The amount funded so far in USD
 * @property {string} created_at - The date the report was created
 * @property {string} updated_at - The date the report was updated
 */
export interface Report {
	id: string;
	title: string;
	summary: string;
	image: string;
	state: string;
	category: string;
	totalCost: number;
	fundedSoFar: number;
	created_at?: string;
	updated_at?: string;
}

/**
 * Represents 1 Hypercert
 * @property {string} __typename - The address of the contract
 * @property {string} contract - The address of the contract where the claim is stored.
 * @property {any} tokenID - The token ID.
 * @property {any} creator - The address of the creator.
 * @property {string} id - The ID of the claim.
 * @property {any} owner - The address of the owner.
 * @property {any} totalUnits - The total number of units.
 * @property {string} uri - The URI of the claim metadata.
 */
export interface Claim {
	__typename?: "Claim";
	contract: string;
	// biome-ignore lint: type definition imported from @hypercerts-org/sdk
	tokenID: any;
	// biome-ignore lint: type definition imported from @hypercerts-org/sdk
	creator?: any | null;
	id: string;
	// biome-ignore lint: type definition imported from @hypercerts-org/sdk
	owner?: any | null;
	// biome-ignore lint: type definition imported from @hypercerts-org/sdk
	totalUnits?: any | null;
	uri?: string | null;
}
