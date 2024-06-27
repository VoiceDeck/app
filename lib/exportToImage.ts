import html2canvas from "html2canvas";
import type { MutableRefObject } from "react";

export const exportAsImage = async (
	ref: MutableRefObject<HTMLDivElement | null>,
) => {
	const el = ref.current;

	if (!el) {
		return;
	}

	const canvas = await html2canvas(el, {
		logging: true,
		backgroundColor: null,
		//useCORS: true,
		imageTimeout: 0,
		onclone: (el) => {
			const elementsWithShiftedDownwardText =
				el.querySelectorAll(".shifted-text");
			console.log(elementsWithShiftedDownwardText);
			// biome-ignore lint/complexity/noForEach: <explanation>
			elementsWithShiftedDownwardText.forEach((el) => {
				// adjust styles or do whatever you want here
				// @ts-ignore
				if (el.style) {
					// @ts-ignore
					return;
				}
			});
		},
	});
	return canvas.toDataURL("image/png", 1.0);
};
