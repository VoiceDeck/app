/**
 * Represents 1 Impact report
 * @property {string} id - The ID of associated hypercert
 * @property {string} title - The title of the report
 * @property {string} description - The description of the report
 * @property {string} created_at - The date the report was created
 * @property {string} updated_at - The date the report was updated
 */
export interface Report {
	id: string;
	title: string;
	description: string;
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
