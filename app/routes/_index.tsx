import { Link } from "@remix-run/react";
import { redirect } from "@remix-run/react";

export default function Index() {
	return (
		<Link to="/reports">
			<div className="text-center text-red-700 font-semibold text-2xl">
				click me
			</div>
		</Link>
	);
}
