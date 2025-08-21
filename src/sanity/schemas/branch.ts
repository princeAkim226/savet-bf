import { defineField, defineType } from "sanity";

export default defineType({
	name: "branch",
	title: "Agence",
	type: "document",
	fields: [
		defineField({ name: "name", title: "Nom", type: "string" }),
		defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
		defineField({ name: "address", title: "Adresse", type: "string" }),
		defineField({ name: "phone", title: "Téléphone", type: "string" }),
		defineField({ name: "email", title: "Email", type: "string" }),
		defineField({ name: "mapUrl", title: "Lien Google Maps", type: "url" }),
	],
});

