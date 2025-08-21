import { createClient } from "next-sanity";

// Hard-coded Sanity configuration (replace with your own if needed)
const projectId = "w3s4jzg8";
const dataset = "production";
const apiVersion = "2025-01-01";

export const sanityClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
});

