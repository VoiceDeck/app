interface VoicedeckStatsProps {
	icon: string;
	heading: string;
	data: string;
	currency?: string;
}

const VoicedeckStats: React.FC<VoicedeckStatsProps> = ({
	icon,
	heading,
	data,
	currency,
}) => {
	return (
		<div className="flex flex-auto items-center gap-5 lg:w-[33%] rounded-3xl bg-vd-blue-200 py-4 pl-5 pr-2">
			<img
				className="h-16 w-16"
				src={`/${icon}.svg`}
				alt={`${icon} illustration`}
			/>
			<div className="flex flex-col gap-1">
				<p className="text-base font-medium">{heading}</p>
				<p className="text-3xl md:text-3xl font-bold">
					{data}
					<span className="text-lg pl-1">{currency}</span>
				</p>
			</div>
		</div>
	);
};

export default VoicedeckStats;
