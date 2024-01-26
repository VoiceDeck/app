# Server Design

## Endpoint Details

### `/impact-reports`
- **Returns**: An array of `Report` objects.
- **Purpose**: To provide impact reports to the UI.
- **Implementation Details**: Uses `fetchReports()` from `server/impactReportHelpers.ts`.

## Server Functions

Located in `app/server/impactReportHelpers.ts`:

- `fetchReports`: Function to retrieve reports, including interaction with Hypercerts.

## Data Models

- **Impact Report**: The report or stories that have been published previously and verified to actually produce an impact.
- **Hypercert**: A token representing a claim of impactful work, which is fractionable and transferable, conforming to the ERC-1155 standard for semi-fungible tokens.
- **Hypercert Metadata**: A set of data associated with a Hypercert, detailing the scope of work, contributors, impact, and rights, stored on IPFS.

## Separation of Concerns

The `/impact-reports` endpoint is responsible for serving impact reports. The implementation details of how the server retrieves data from Hypercert are abstracted away and managed within the `app/server/impactReportHelpers.ts` file.
