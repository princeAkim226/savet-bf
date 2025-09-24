import { sanityClient } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const product = await sanityClient.fetch(`
		*[_type == "product" && slug.current == $slug][0]{
			title, description, category
		}
	`, { slug });

	if (!product) {
		return {
			title: 'Produit non trouvé',
		};
	}

	return {
		title: `${product.title} - SAVET Burkina Faso`,
		description: product.description || 'Détails du produit ou service',
	};
}

// Générer les paramètres statiques
export async function generateStaticParams() {
	const products = await sanityClient.fetch(`
		*[_type == "product"]{
			slug
		}
	`);

	return products.map((product: { slug: { current: string } }) => ({
		slug: product.slug.current,
	}));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const product = await sanityClient.fetch(`
		*[_type == "product" && slug.current == $slug][0]{
			title, description, category, image, features, isService, content
		}
	`, { slug });

	if (!product) {
		notFound();
	}

	const cleanProduct = cleanSanityData(product) as Record<string, unknown>;

	return (
		<div className="min-h-screen pt-20">
			{/* Breadcrumb */}
			<div className="bg-white border-b">
				<div className="container py-4">
					<nav className="flex items-center space-x-2 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-primary transition-colors">
							Accueil
						</Link>
						<span>/</span>
						<Link href="/products" className="hover:text-primary transition-colors">
							Produits & Services
						</Link>
						<span>/</span>
						<span className="text-foreground">{cleanProduct.title}</span>
					</nav>
				</div>
			</div>

			{/* Product Header */}
			<section className="py-16 bg-gradient-to-br from-primary/5 to-emerald-50">
				<div className="container">
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<div className="space-y-6">
							<div className="inline-flex items-center space-x-2">
								<span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
									{cleanProduct.isService ? "Service" : "Produit"}
								</span>
								{cleanProduct.category && (
									<span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
										{cleanProduct.category}
									</span>
								)}
							</div>
							<h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
								{cleanProduct.title}
							</h1>
							{cleanProduct.description && (
								<p className="text-xl text-muted-foreground leading-relaxed">
									{cleanProduct.description}
								</p>
							)}
						</div>
						<div className="relative">
							{cleanProduct.image ? (
								<Image 
									src={urlForImage(cleanProduct.image).width(800).height(600).url()} 
									alt={cleanProduct.title} 
									width={800} 
									height={600} 
									className="rounded-3xl object-cover w-full h-auto shadow-2xl" 
								/>
							) : (
								<div className="w-full h-96 bg-gradient-to-br from-primary/20 to-emerald-100 rounded-3xl flex items-center justify-center">
									<div className="text-center space-y-4">
										<div className="w-24 h-24 bg-gradient-to-br from-primary to-emerald-600 rounded-full mx-auto flex items-center justify-center">
											<span className="text-white text-3xl font-bold">📦</span>
										</div>
										<p className="text-muted-foreground">Image du produit</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Product Content */}
			<section className="py-20">
				<div className="container">
					<div className="grid lg:grid-cols-3 gap-16">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-8">
							{cleanProduct.content ? (
								<div className="card p-8">
									<h2 className="text-2xl font-semibold mb-6">Description détaillée</h2>
									<div className="prose prose-lg max-w-none">
										{cleanProduct.content}
									</div>
								</div>
							) : (
								<div className="card p-8">
									<h2 className="text-2xl font-semibold mb-6">Description détaillée</h2>
									<p className="text-muted-foreground">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
										Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
									</p>
								</div>
							)}

							{/* Features */}
							{cleanProduct.features && cleanProduct.features.length > 0 && (
								<div className="card p-8">
									<h2 className="text-2xl font-semibold mb-6">Caractéristiques</h2>
									<div className="grid md:grid-cols-2 gap-4">
										{cleanProduct.features.map((feature: string, index: number) => (
											<div key={index} className="flex items-center space-x-3">
												<div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
													<span className="text-white text-xs">✓</span>
												</div>
												<span className="text-muted-foreground">{feature}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Contact CTA */}
							<div className="card p-6 text-center">
								<h3 className="text-lg font-semibold mb-4">Intéressé par ce produit ?</h3>
								<p className="text-muted-foreground mb-6">
									Contactez-nous pour plus d&apos;informations ou pour passer une commande.
								</p>
								<Link href="/#contact" className="btn-primary w-full">
									Nous contacter
								</Link>
							</div>

							{/* Product Info */}
							<div className="card p-6">
								<h3 className="text-lg font-semibold mb-4">Informations</h3>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Type:</span>
										<span className="font-medium">
											{cleanProduct.isService ? "Service" : "Produit"}
										</span>
									</div>
									{cleanProduct.category && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Catégorie:</span>
											<span className="font-medium">{cleanProduct.category}</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
} 