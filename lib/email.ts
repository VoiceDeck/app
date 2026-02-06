import "server-only";
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
      transactionalId: "cml2clndy018i0i01c4utja08",
      dataVariables: {
        donor_name: data.donorName,
        campaign_title: data.campaignTitle,
        campaign_image_url: data.campaignImageUrl,
        amount: data.amount,
        donation_date: new Date(data.donationDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
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
