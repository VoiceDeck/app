import {
	AlertCircle,
	GlassWater,
	Heart,
	Lightbulb,
	LucideIcon,
	Salad,
} from "lucide-react";

const iconComponents: { [key: string]: LucideIcon } = {
	Hunger: Salad,
	Thirst: GlassWater,
	Opportunity: Lightbulb,
	Dignity: Heart,
};

interface DynamicCategoryIconProps {
	category: string;
	color?: string;
	strokeWidth?: number;
	size?: number;
}

const DynamicCategoryIcon: React.FC<DynamicCategoryIconProps> = ({
	category,
	color = "#E48F85",
	strokeWidth = 1.5,
	size = 18,
}) => {
	const CategoryIcon = iconComponents[category];
	if (!CategoryIcon) {
		return <AlertCircle size={14} />; // or a placeholder component
	}
	return <CategoryIcon color={color} strokeWidth={strokeWidth} size={size} />;
};

export default DynamicCategoryIcon;
