import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function loader(args: LoaderFunctionArgs) {
	throw redirect("/reports", 302);
}
