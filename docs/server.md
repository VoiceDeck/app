# Server Design

## Endpoint Details

### `/impact-reports`
- **Returns**: An array of `Report` objects.
- **Purpose**: To provide impact reports to the UI.
- **Implementation Details**: Uses `getHypercertClaims()` and `getHypercertMetadata()` from `server/hypercertHelpers.tsx`.

## Server Functions

Located in `server/hypercertHelpers.tsx`:

- `getHypercertClaims`: Function to retrieve claims from Hypercert.
- `getHypercertMetadata`: Function to obtain metadata from IPFS.

## Data Models

- **Impact Report**: The report or stories that has been published previously and verified that actually produce impact.
- **Hypercert**: A token representing a claim of impactful work, which is fractionable and transferable, conforming to the ERC-1155 standard for semi-fungible tokens.
- **Hypercert Metadata**: A set of data associated with a Hypercert, detailing the scope of work, contributors, impact, and rights, stored on IPFS.

## Separation of Concerns

`/impact-reports` endpoint is responsible for serving impact reports. The implementation details of how the server retrieves data from Hypercert are abstracted away and managed within the `server/hypercertHelpers.tsx` file
