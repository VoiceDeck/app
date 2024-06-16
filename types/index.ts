import type { Address, Hash } from "viem";

/**
 * Defines the structure of an Impact Report.
 *
 * @interface Report
 * @property {string} hypercertId - Claim id of hypercert.
 * @property {string} title - Title of the report.
 * @property {string} summary - Brief summary of the report.
 * @property {string} image - the image representing the report.
 * @property {string} originalReportUrl - URL to the original report.
 * @property {string} state - State where the impact is being made.
 * @property {string} category - Category under which the report falls.
 * @property {string} workTimeframe - Timeframe during which the work was performed.
 * @property {string} impactScope - Scope of the impact.
 * @property {string} impactTimeframe - Timeframe of the impact.
 * @property {string[]} contributors - List of contributors to the report.
 * @property {string} cmsId - Identifier for the report in the CMS.
 * @property {string} status - Publication status of the report.
 * @property {string | null} dateCreated - Date when the report was created.
 * * @property {string | null} dateUpdated - Date when the report was last updated.
 * @property {string} slug - Slug for the report URL.
 * @property {string | null} story - Detailed story of the report.
 * @property {number | null} bcRatio - bc ratio of the impact.
 * @property {number | null} villagesImpacted - Number of villages impacted.
 * @property {number | null} peopleImpacted - Number of people impacted.
 * @property {string[] | null} verifiedBy - Entities that have verified the report.
 * @property {string | null} byline - Byline of the report.
 * @property {number} totalCost - Total cost of the report.
 * @property {number} fundedSoFar - Amount funded so far.
 */

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

/*************
 *
 * type definition from Directus CMS collections
 *
 ************/

// Directus schema of `report` collection
export interface CMSContent {
	// properties for hypercert minting
	title: string | null;
	summary: string | null;
	image: string | null;
	original_report_url: string | null;
	states: string[] | null;
	category: string | null;
	work_timeframe: string | null;
	impact_scope: string | null;
	impact_timeframe: string | null;
	// NOTE: it's actually comma separated string
	contributor: string | null;

	//non hypercert propoerties
	id: string;
	status: string;
	date_created: string | null;
	slug: string;
	story: string | null;
	bc_ratio: number | null;
	villages_impacted: number | null;
	people_impacted: number | null;
	verified_by: string[] | null;
	date_updated: string | null;
	byline: string | null;
	total_cost: string | null;
}

// Directus schema of `contributions` collection
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
