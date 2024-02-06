interface VoicedeckStatsProps {
	icon: string;
	heading: string;
	data: string;
	currency?: string;
}

export default function VoicedeckStats({
	icon,
	heading,
	data,
	currency,
}: VoicedeckStatsProps) {
	return (
		<div className="flex flex-auto items-center gap-4 lg:w-[33%] rounded-3xl bg-vd-blue-200 p-4">
			<img src={`/${icon}.svg`} alt={`${icon} illustration`} />
			<div className="flex flex-col gap-2">
				<p className="text-base font-medium">{heading}</p>
				<p className="text-3xl md:text-3xl font-bold">
					{data}
					<span className="text-lg pl-1">{currency}</span>
				</p>
			</div>
		</div>
	);
}
