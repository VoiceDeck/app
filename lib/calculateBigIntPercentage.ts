export const calculateBigIntPercentage = (
	numerator: bigint | string | null | undefined,
	denominator: bigint | string | null | undefined,
) => {
	if (!numerator || !denominator) {
		return undefined;
	}
	return Number((BigInt(numerator) * BigInt(100)) / BigInt(denominator));
};
