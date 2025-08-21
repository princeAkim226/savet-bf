import { defineConfig } from "sanity";
import { visionTool } from "@sanity/vision";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = "w3s4jzg8";
const dataset = "production";

export default defineConfig({
	name: "savet-studio",
	title: "SAVET Burkina Studio",
	projectId,
	dataset,
	plugins: [structureTool(), visionTool()],
	schema: {
		types: schemaTypes,
	},
});

