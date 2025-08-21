import { defineField, defineType } from "sanity";

export default defineType({
	name: "post",
	title: "Actualité / Article",
	type: "document",
	fields: [
		defineField({ name: "title", title: "Titre", type: "string" }),
		defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
		defineField({ name: "excerpt", title: "Accroche", type: "text" }),
		defineField({ name: "coverImage", title: "Image de couverture", type: "image", options: { hotspot: true } }),
		defineField({ name: "publishedAt", title: "Publié le", type: "datetime" }),
		defineField({ name: "content", title: "Contenu", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
		defineField({ name: "author", title: "Auteur", type: "string" }),
	],
});

