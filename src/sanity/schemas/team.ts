import { defineField, defineType } from "sanity";

export default defineType({
	name: "team",
	title: "Membre de l'équipe",
	type: "document",
	fields: [
		defineField({ name: "name", title: "Nom", type: "string" }),
		defineField({ name: "role", title: "Rôle", type: "string" }),
		defineField({ name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] }),
		defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
		defineField({ name: "email", title: "Email", type: "string" }),
		defineField({ name: "phone", title: "Téléphone", type: "string" }),
		defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
	],
});

