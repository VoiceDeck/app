import type { Address, Hash } from "viem";

export interface Hypercert {
	metadata: {
		name: string;
		work_scope: string[];
		work_timeframe_to: Date;
		work_timeframe_from: Date;
		impact_scope: string[];
		image: string;
		description: string;
		external_url: string;
		contributors: string[];
		allow_list_uri: string;
	};
	hypercert_id: string;
	creator_address: string;
}

export type Metadata = {
	allow_list_uri: string;
	contributors: string[];
	description: string;
	external_url: string;
	id: string;
	image: string;
	impact_scope: string[];
	impact_timeframe_from: number;
	impact_timeframe_to: number;
	name: string;
	parsed: boolean;
	properties: JSON;
	rights: string[];
	uri: string;
	work_scope: string[];
	work_timeframe_from: string;
	work_timeframe_to: string;
};

export type Fraction = {
	id: string;
	units: number;
	owner_address: string;
};

export type HypercertData = {
	id: string;
	contracts_id: string;
	token_id: number;
	hypercert_id: string;
	block_number: number;
	owner_address: string;
	value: number;
	units: number;
	uri: string;
	creator_address: string;
	metadata: Metadata;
	fractions: Fraction[];
	// Add other fields from the `claims` table if there are any
};

export type FractionMetaData = {
	id: string;
	name: string;
	image: string;
	description: string;
	work_timeframe_from: Date;
	work_timeframe_to: Date;
	work_scope: string[];
	contributors: string[];
	external_url: string;
};

export interface Report {
	// properties for hypercert minting
	hypercertId: string;
	title: string;
	summary: string;
	image: string;
	originalReportUrl: string;
	state: string;
	category: string;
	workTimeframe: string;
	impactScope: string;
	impactTimeframe: string;
	contributors: string[];

	// properties stored in CMS
	cmsId: string;
	dateCreated: string | null;
	dateUpdated: string | null;
	status: string;
	slug: string;
	story: string | null;
	bcRatio: number | null;
	villagesImpacted: number | null;
	peopleImpacted: number | null;
	verifiedBy: string[] | null;
	byline: string | null;
	totalCost: number;

	// properties regarding to hypercert marketplace
	fundedSoFar: number;

	order: Order | null;
}

/*************
 *
 * type definition from Hypercerts SDK
 *
 ************/

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

// Represents an Order in the Hypercerts Marketplace
export type Order = {
	hypercertId: string;
	additionalParameters: string;
	amounts: number[];
	chainId: number;
	collection: string;
	collectionType: number;
	createdAt: string;
	currency: string;
	endTime: number;
	globalNonce: string;
	id: string;
	itemIds: string[];
	orderNonce: string;
	price: string;
	quoteType: number;
	signature: string;
	signer: string;
	startTime: number;
	strategyId: number;
	subsetNonce: number;
};
export type Contribution = {
	txid: Hash;
	hypercert_id: string;
	sender: Address;
	amount: number;
	date_created: string;
	comment?: string;
};

export type SupportReportInfo = {
	image: Partial<Metadata>["image"];
	title: Partial<Metadata>["name"];
	hypercertId: Partial<HypercertData>["hypercert_id"];
};

export interface ISortingOption {
	label: string;
	value: string;
	sortFn: (a: HypercertData, b: HypercertData) => number;
}
