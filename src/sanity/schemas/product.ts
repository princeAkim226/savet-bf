import { defineField, defineType } from "sanity";

export default defineType({
	name: "product",
	title: "Produit / Service",
	type: "document",
	fields: [
		defineField({ name: "title", title: "Nom", type: "string" }),
		defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
		defineField({ name: "category", title: "Catégorie", type: "string" }),
		defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }] }),
		defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
		defineField({ name: "features", title: "Caractéristiques", type: "array", of: [{ type: "string" }] }),
		defineField({ name: "isService", title: "Est un service?", type: "boolean", initialValue: false }),
	],
});

