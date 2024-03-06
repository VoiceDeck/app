
# VoiceDeck

VoiceDeck is a platform that allows users to contribute retroactive funding for impactful grassroots journalism in India. Donors receive fractional shares of a [HyperCert](https://hypercerts.org/) representing the impact of the reporting they've supported.

## Features

### Within the VoiceDeck app, users can

- Search reports by category, state, progress
- Examine report details, impact assessment, funding status
- Anonymously prove Indian citizenship
- Contribute funds with embedded crypto wallet
- Track contribution activity and metrics

## Run Locally

### Clone the repository

```bash
  git clone git@github.com:VoiceDeck/app.git
```

#### Install dependencies

```bash
  cd app && pnpm install
```

#### Start the server

```bash
  pnpm dev
```

## Tech Stack

- [Remix](https://remix.run/) + [Vite](https://vitejs.dev/)
- [Million.js](https://million.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) components
- [Victory](https://formidable.com/open-source/victory/) charts
- [Biome](https://biomejs.dev/) formatter/linter

We recommend [direnv](https://direnv.net/) for managing your environment variables

## Server Design

### Endpoint Details

`/impact-reports`

- **Returns**: An array of `Report` objects.
- **Purpose**: To provide impact reports to the UI.
- **Implementation Details**: Uses `fetchReports()` from `server/impactReportHelpers.ts`.

### Server Functions

Located in `app/server/impactReportHelpers.ts`:

- `fetchReports`: Function to retrieve reports, including interaction with Hypercerts.

### Data Models

- **Impact Report**: The report or stories that have been published previously and verified to actually produce an impact.
- **Hypercert**: A token representing a claim of impactful work, which is fractionable and transferable, conforming to the ERC-1155 standard for semi-fungible tokens.
- **Hypercert Metadata**: A set of data associated with a Hypercert, detailing the scope of work, contributors, impact, and rights, stored on IPFS.

### Separation of Concerns

The `/impact-reports` endpoint is responsible for serving impact reports. The implementation details of how the server retrieves data from Hypercert are abstracted away and managed within the `app/server/impactReportHelpers.ts` file.

## Getting Started

### Prerequisites

Node.js: Before anything else, Remix.run requires that you have either a Active or Maintenance version of Node.js installed. [Remix Documentation](https://remix.run/docs/en/main/other-api/node)

Optimism Sepolia: Intuition is currently deployed on Optimism Sepolia Testnet. To interact with the Intuition API, you'll need to connect to the [Optimism Sepolia Testnet](https://docs.optimism.io/chain/networks).

### Network Configuration

| Parameter                     | Value                                     |
| ----------------------------- | ----------------------------------------- |
| Network Name                  | `OP Sepolia`                              |
| RPC URL                       | `https://sepolia.optimism.io`             |
| Chain ID                      | `11155420`                                |
| Currency Symbol               | `ETH`                                     |
| Block Explorer URL (Optional) | `https://sepolia-optimistic.etherscan.io` |

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app+/_index.tsx`. The page auto-updates as you edit the file.

## Shadcn

Shadcn provides beautifully designed components that you can copy and paste into your apps and enables you to bootstrap them via cli ([Shadcn Documentation](https://ui.shadcn.com/)). It 5x's your productivity and allows you to focus on what matters most, your business logic + features. Even better, we have set up the config for you so you can use it out of the box 🤝.

Example Usage:

```bash
npx shadcn-ui@latest add form
```

## Helpful References

- [Remix.run Documentation](https://remix.run/)
- [Vite Documentation](https://vitejs.dev/)
- [Remix-Auth Documentation](https://github.com/sergiodxa/remix-auth)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Alchemy Documentation](https://docs.alchemy.com/)
