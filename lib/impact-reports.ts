import "server-only";

import {
  HypercertClient,
} from "@hypercerts-org/sdk";
import { Mutex } from "async-mutex";

import type { Report } from "@/types";
import { getCMSReports, getFundedAmountByHCId } from "./directus";
import { getOrders } from "./marketplace";
import { delay } from "./utils";
import { getHypercertsByOwner } from "@/hypercerts/getHypercertsByOwner";
import { FragmentOf } from "gql.tada";

import { HypercertFullFragment } from "@/hypercerts/fragments/hypercert-full.fragment";

let reports: Report[] | null = null;
let claims:
  | NonNullable<Awaited<ReturnType<typeof getHypercertsByOwner>>>["data"]
  | null = null;
const reportsMutex = new Mutex();

let hypercertClient: HypercertClient | null = null;

/**
 * Fetches reports either from the cache or by generating them if not already cached.
 * @returns A promise that resolves to an array of reports.
 * @throws Throws an error if fetching reports fails.
 */
export const fetchReports = async (): Promise<Report[]> => {
  if (!process.env.HC_OWNER_ADDRESS) {
    throw new Error("[server] Owner address environment variable is not set");
  }
  const ownerAddress = process.env.HC_OWNER_ADDRESS;

  try {
    if (reports) {
      console.log(
        "[server] Reports already exist, no need to fetch from remote",
      );
      console.log(`[server] Existing reports: ${reports.length}`);
    } else {
      console.log(
        `[server] Fetching reports from remote using owner address: ${ownerAddress}`,
      );
      const hypercertsRes = await getHypercertsByOwner({ ownerAddress });

      if (!hypercertsRes) {
        throw new Error(
          `[Hypercerts] Failed to fetch claims owned by ${ownerAddress}`,
        );
      }
      // console.log("hypercertsRes", hypercertsRes.data);
      claims = hypercertsRes.data;

      const _reports = await updateReports();

      // step 3: get orders from marketplace
      const orders = await getOrders(_reports);

      const orderMap = new Map(orders.map(order => [order?.hypercertId, order]));


      reports = _reports.map(report => {
        const order = orderMap.get(report.hypercertId);
        if (order) {
          report.order = order;
        } else if (report.fundedSoFar < report.totalCost) {
          console.warn(`[server] No order found for hypercert ${report.hypercertId}`);
        }
        return report;
      });

      console.log(`[server] total fetched reports: ${reports.length}`);
    }

    return reports;
  } catch (error) {
    console.error(`[server] Failed to fetch reports: ${error}`);
    throw new Error(`[server] Failed to fetch reports: ${error}`);
  }
};

/**
 * Fetches a report by its slug.
 * @param slug - The slug of the report to fetch.
 * @returns A promise that resolves to the report.
 * @throws Throws an error if the report with the specified slug is not found.
 */
export const fetchReportBySlug = async (slug: string): Promise<Report> => {
  try {
    let reports = await getReports();

    const foundReport = reports.find((report: Report) => report.slug === slug);
    if (!foundReport) {
      throw new Error(`[server] Report with slug '${slug}' not found.`);
    }

    return foundReport;
  } catch (error) {
    console.error(`[server] Failed to get report by slug ${slug}: ${error}`);
    throw new Error(`[server] Failed to get report by slug ${slug}: ${error}`);
  }
};

export const fetchReportByHCId = async (
  hypercertId: string,
): Promise<Report> => {
  try {
    let reports = await getReports();

    const foundReport = reports?.find(
      (report: Report) => report.hypercertId === hypercertId,
    );
    if (!foundReport) {
      throw new Error(
        `[server] Report with hypercert Id '${hypercertId}' not found.`,
      );
    }

    return foundReport;
  } catch (error) {
    throw new Error(
      `[server] Failed to get report with hypercert Id '${hypercertId}': ${error}`,
    );
  }
};

export const getReports = async (): Promise<Report[]> => {
  return reports ?  reports ?? [] as Report[] : await fetchReports();
};

/**
 * Retrieves the singleton instance of the HypercertClient.
 * @returns The HypercertClient instance.
 */
export const getHypercertClient = (): HypercertClient => {
  if (hypercertClient) {
    return hypercertClient;
  }

  hypercertClient = new HypercertClient({ environment: "production" }); // Optimism

  return hypercertClient;
};

/**
 * Fetches the claims owned by the specified address from the Hypercert indexer.
 * @param ownerAddress - The address of the owner of the claims.
 * @param indexer - An instance of HypercertIndexer to retrieve claims from the [Graph](https://thegraph.com/docs/en/)
 * @returns A promise that resolves to an array of claims.
 * @throws Will throw an error if the owner address is not set or the claims cannot be fetched.
 */
export const getHypercertClaims = async (ownerAddress: string) => {
  if (claims) {
    console.log(`[server] Claims already exist, no need to fetch from remote`);
    console.log(`[server] Existing claims: ${claims.length}`);
  } else {
    try {
      console.log(`[Hypercerts] Fetching claims owned by ${ownerAddress}`);

      const hypercertsRes = await getHypercertsByOwner({
        ownerAddress,
      });
      if (!hypercertsRes) {
        throw new Error(
          `[Hypercerts] Failed to fetch claims owned by ${ownerAddress}`,
        );
      }
      // console.log("Query Results:", hypercertsRes);
      claims = hypercertsRes?.data;
      // console.log(`[Hypercerts] Fetched claims: ${claims ? claims.length : 0}`);
    } catch (error) {
      console.error(
        `[Hypercerts] Failed to fetch claims owned by ${ownerAddress}: ${error}`,
      );
      throw new Error(
        `[Hypercerts] Failed to fetch claims owned by ${ownerAddress}: ${error}`,
      );
    }
  }

  return claims;
};

export const fetchNewReports = async () => {
  if (!process.env.HC_OWNER_ADDRESS) {
    throw new Error("[server] Owner address environment variable is not set");
  }

  const ownerAddress = process.env.HC_OWNER_ADDRESS;
  const hypercertsRes = await getHypercertsByOwner({
    ownerAddress,
  });
  const newClaims = hypercertsRes?.data;
  if (!newClaims) {
    console.error(`[server] Failed to fetch claims owned by ${ownerAddress}`);
    return;
  }

  console.log(`[server] update new reports if there are new claims`);
  if (claims && newClaims.length === claims.length) {
    console.log(`[server] no new claims, no need to update reports`);
    return;
  }

  if (!claims || newClaims.length > claims.length) {
    console.log(`[server] claims in the cache are outdated, updating reports`);
    claims = newClaims;

    const _reports = await updateReports();

    const orders = await getOrders(_reports);

    const orderMap = new Map(orders.map(order => [order?.hypercertId, order]));


    reports = _reports.map(report => {
      const order = orderMap.get(report.hypercertId);
      if (order) {
        report.order = order;
      } else if (report.fundedSoFar < report.totalCost) {
        console.warn(`[server] No order found for hypercert ${report.hypercertId}`);
      }
      return report;
    });

    console.log(`[server] total fetched reports: ${reports.length}`);
  }
};

const updateReports = async (): Promise<Report[]> => {
  if (!claims) {
    throw new Error(
      `[server] Claims are not fetched yet, please fetch claims first.`,
    );
  }

  const fromCMS = await getCMSReports();

  const existingReportIds = reports
    ? reports.map((report) => report.hypercertId)
    : [];
  const reportsToUpdatePromises = claims
    .filter(
      (claim) =>
        claim.hypercert_id && !existingReportIds.includes(claim.hypercert_id),
    )
    .map(async (claim, index) => {
      console.log(`[server] Processing claim with ID: ${claim.hypercert_id}.`);

      // a delay to spread out the requests
      await delay(index * 20);

      // step 2: get offchain data from CMS

      const cmsReport = fromCMS.find(
        (cmsReport) => cmsReport.title === claim?.metadata?.name,
      );
      if (!cmsReport) {
        // TODO: change this to just logging
        throw new Error(
          `[server] CMS content for report titled '${claim?.metadata?.name}' not found.`,
        );
      }

      return {
        hypercertId: claim.hypercert_id,
        title: claim?.metadata?.name,
        summary: claim?.metadata?.description,
        image: "https://directus.voicedeck.org/assets/" + cmsReport.image,
        category: claim?.metadata?.work_scope?.[0],
        workTimeframe: `${(new Date(Number(claim.metadata?.work_timeframe_from) * 1000)).toLocaleDateString()} - ${(new Date(Number(claim.metadata?.work_timeframe_to) * 1000)).toLocaleDateString()}`,
        impactScope: claim?.metadata?.impact_scope?.[0],
        impactTimeframe: `${new Date(Number(claim.metadata?.impact_timeframe_from) * 1000).toLocaleDateString()} - ${(new Date(Number(claim.metadata?.impact_timeframe_to) * 1000).toLocaleDateString())}`,
        contributors: claim?.metadata?.contributors?.map(
          (name: string) => name,
        ),
        cmsId: cmsReport.id,
        status: cmsReport.status,
        dateCreated: cmsReport.date_created,
        slug: cmsReport.slug,
        story: cmsReport.story,
        state: cmsReport.states[0],
        bcRatio: cmsReport.bc_ratio,
        villagesImpacted: cmsReport.villages_impacted,
        peopleImpacted: cmsReport.people_impacted,
        verifiedBy: cmsReport.verified_by,
        dateUpdated: cmsReport.date_updated,
        byline: cmsReport.byline,
        totalCost: Number(cmsReport.total_cost),
        originalReportUrl: cmsReport.original_report_url,
        fundedSoFar: await getFundedAmountByHCId(claim.hypercert_id as string),
      } as Report;
    });

  const reportsToUpdate = await Promise.all(reportsToUpdatePromises);

  if (reportsToUpdate.length > 0) {
    console.log(
      `[server] Found ${reportsToUpdate.length} new. Updating reports...`,
    );
    reports = [...(reports || []), ...reportsToUpdate];
    console.log(`[server] Reports updated. Total reports: ${reports.length}`);
  } else {
    console.log(
      `[server] No new or updated claims found. No need to update reports.`,
    );
  }

  return reports as Report[];
};

// update the fundedSoFar field of the report
export const updateFundedAmount = async (
  hypercertId: string,
  amount: number,
): Promise<void> => {
  const release = await reportsMutex.acquire();

  try {
    const currentReports = await getReports();
    const updatedReports = currentReports.map(report => 
      report.hypercertId === hypercertId
        ? { ...report, fundedSoFar: report.fundedSoFar + amount }
        : report
    );
    
    reports = updatedReports;
  } finally {
    release();
  }
};
