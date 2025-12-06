import { LoopsClient } from "loops";

const loops = new LoopsClient(process.env.LOOPS_API_KEY ?? "");

export interface ContributionEmailData {
  donorName: string;
  campaignTitle: string;
  campaignImageUrl: string;
  amount: number;
  donationDate: string;
  campaignUrl: string;
  email: string;
}

export async function sendContributionEmail(data: ContributionEmailData): Promise<void> {
  console.log("HIIIIII EMAIL", data)
  try {
    await loops.sendTransactionalEmail({
      transactionalId: "cmiu640j221kt0u0ikma8artf",
      dataVariables: {
        donor_name: data.donorName,
        campaign_title: data.campaignTitle,
        campaign_image_url: data.campaignImageUrl,
        amount: data.amount,
        donation_date: data.donationDate,
        campaign_url: data.campaignUrl,
        currency_symbol: "$"
      },
      email: data.email
    });
  } catch (error) {
    console.error("Failed to send contribution email:", error);
    throw error;
  }
}
