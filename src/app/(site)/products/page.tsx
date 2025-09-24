import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";

// Fonction pour nettoyer les données Sanity
function cleanSanityData(data: unknown): unknown {
	if (Array.isArray(data)) {
		return data.map(cleanSanityData);
	}
	if (data && typeof data === 'object') {
		const dataObj = data as Record<string, unknown>;
		if (dataObj._type === 'block' && dataObj.children) {
			return (dataObj.children as unknown[]).map((child: unknown) => (child as { text?: string }).text || '').join(' ');
		}
		const cleaned: Record<string, unknown> = {};
		for (const key in dataObj) {
			if (key !== '_type' && key !== '_key' && key !== 'markDefs' && key !== 'style') {
				cleaned[key] = cleanSanityData(dataObj[key]);
			}
		}
		return cleaned;
	}
	return data;
}

export const metadata = {
	title: 'Produits & Services - SAVET Burkina Faso',
	description: 'Découvrez notre gamme complète de produits et services vétérinaires',
};

export default async function ProductsPage() {
	const products = await sanityClient.fetch(`
		*[_type == "product"]|order(title asc){
			title, slug, category, description, image, features, isService
		}
	`);

	const cleanProducts = (cleanSanityData(products) as unknown[]) || [];

	// Grouper par catégorie
	const productsByCategory = cleanProducts.reduce((acc: Record<string, unknown[]>, product: unknown) => {
		const category = product.category || 'Autres';
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(product);
		return acc;
	}, {});

	return (
		<div className="min-h-screen pt-20">
			{/* Header */}
			<section className="py-16 bg-gradient-to-br from-primary/5 to-emerald-50">
				<div className="container">
					<div className="text-center space-y-6">
						<h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
							Produits & Services
						</h1>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Découvrez notre gamme complète de solutions vétérinaires, équipements d&apos;élevage, 
							nutrition animale et solutions de biosécurité.
						</p>
					</div>
				</div>
			</section>

			{/* Products List */}
			<section className="py-20">
				<div className="container">
					{Object.entries(productsByCategory).map(([category, categoryProducts]: [string, unknown[]]) => (
						<div key={category} className="mb-20">
							<h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
								{category}
							</h2>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
								{categoryProducts.map((product: unknown, index: number) => (
									<Link 
										href={`/products/${product.slug?.current}`} 
										key={product.slug?.current || index}
										className="block"
									>
										<div className="card card-hover overflow-hidden hover-lift cursor-pointer h-full">
											<div className="relative">
												{product.image ? (
													<Image 
														src={urlForImage(product.image).width(600).height(400).url()} 
														alt={product.title} 
														width={600} 
														height={400} 
														className="w-full h-48 object-cover" 
													/>
												) : (
													<div className="w-full h-48 bg-gradient-to-br from-primary/10 to-emerald-100 flex items-center justify-center">
														<span className="text-muted-foreground">Image</span>
													</div>
												)}
												<div className="absolute top-4 left-4">
													<span className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
														{product.isService ? "Service" : "Produit"}
													</span>
												</div>
											</div>
											<div className="p-6 space-y-3 flex-1">
												<h3 className="text-xl font-semibold text-card-foreground">{product.title}</h3>
												<p className="text-muted-foreground line-clamp-3">{product.description || "Description du produit ou service"}</p>
												{product.features && product.features.length > 0 && (
													<div className="pt-2">
														<div className="flex flex-wrap gap-1">
															{product.features.slice(0, 3).map((feature: string, idx: number) => (
																<span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
																	{feature}
																</span>
															))}
															{product.features.length > 3 && (
																<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
																	+{product.features.length - 3} autres
																</span>
															)}
														</div>
													</div>
												)}
												<div className="pt-4">
													<span className="text-sm text-primary font-medium">Voir les détails →</span>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-white">
				<div className="container">
					<div className="text-center space-y-8">
						<h2 className="text-3xl font-bold text-slate-800">
							Vous ne trouvez pas ce que vous cherchez ?
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Notre équipe est là pour vous aider à trouver la solution adaptée à vos besoins.
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							<Link href="/#contact" className="btn-primary">
								Nous contacter
							</Link>
							<Link href="/" className="btn-secondary">
								Retour à l&apos;accueil
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
} 