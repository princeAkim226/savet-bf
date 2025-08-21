import createImageUrlBuilder from "@sanity/image-url";

const projectId = "w3s4jzg8";
const dataset = "production";

export const urlForImage = (source: any) =>
	createImageUrlBuilder({ projectId, dataset }).image(source);

