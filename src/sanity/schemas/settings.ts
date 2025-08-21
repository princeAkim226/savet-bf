import { defineField, defineType } from "sanity";

export default defineType({
	name: "settings",
	title: "Paramètres du site",
	type: "document",
	fields: [
		defineField({ name: "siteTitle", title: "Titre du site", type: "string" }),
		defineField({ name: "tagline", title: "Slogan", type: "string" }),
		defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
		defineField({ name: "hero", title: "Section Accueil", type: "object", fields: [
			{ name: "title", title: "Titre", type: "string" },
			{ name: "subtitle", title: "Sous-titre", type: "text" },
			{ name: "ctaLabel", title: "Label CTA", type: "string" },
			{ name: "ctaHref", title: "Lien CTA", type: "string" },
			{ name: "image", title: "Image", type: "image", options: { hotspot: true } },
		] }),
		defineField({ name: "contact", title: "Contact", type: "object", fields: [
			{ name: "email", title: "Email", type: "string" },
			{ name: "phone", title: "Téléphone", type: "string" },
			{ name: "address", title: "Adresse", type: "string" },
			{ name: "mapUrl", title: "Lien Google Maps", type: "url" },
		] }),
		defineField({ name: "socials", title: "Réseaux sociaux", type: "array", of: [{
			type: "object", fields: [
				{ name: "platform", title: "Plateforme", type: "string" },
				{ name: "url", title: "URL", type: "url" },
			]
		}] }),
	],
});

