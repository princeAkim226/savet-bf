import groq from "groq";

export const settingsQuery = groq`*[_type == "settings"][0]{
	siteTitle, tagline, logo, hero, contact, socials
}`;

export const productsQuery = groq`*[_type == "product"]|order(title asc){
	title, slug, category, description, image, features, isService
}`;

export const branchesQuery = groq`*[_type == "branch"]|order(name asc){
	name, slug, address, phone, email, mapUrl
}`;

export const postsQuery = groq`*[_type == "post"]|order(publishedAt desc){
	title, slug, excerpt, coverImage, publishedAt, author
}`;

export const teamQuery = groq`*[_type == "team"]|order(name asc){
	name, role, bio, photo, email, phone, linkedin
}`;

