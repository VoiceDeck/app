import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

import { Input } from "../ui/input";

export function ListAskedPrice({
	price,
	setPrice,
	currency,
	setCurrency,
}: {
	price: string;
	setPrice: (price: string) => void;
	currency: string;
	setCurrency: (currency: string) => void;
}) {
	return (
		<div className="flex w-full gap-2">
			<Input
				name="price"
				type="text"
				placeholder="Price"
				value={price}
				onChange={(e) => setPrice(e.target.value)}
				className="flex-grow"
			/>
			<Select value={currency} onValueChange={setCurrency}>
				<SelectTrigger className="w-[120px]">
					<SelectValue placeholder="Currency" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ETH">ETH</SelectItem>
					<SelectItem value="wETH">wETH</SelectItem>
					<SelectItem value="USDC">USDC</SelectItem>
					<SelectItem value="DAI">DAI</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
