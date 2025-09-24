import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/sanity/client";
import { settingsQuery, productsQuery, branchesQuery, postsQuery, teamQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

// Fonction pour nettoyer les données Sanity
function cleanSanityData(data: unknown): unknown {
	if (Array.isArray(data)) {
		return data.map(cleanSanityData);
	}
	if (data && typeof data === 'object') {
		// Si c'est un objet PortableText, on le convertit en string
		const dataObj = data as Record<string, unknown>;
		if (dataObj._type === 'block' && dataObj.children) {
			return (dataObj.children as unknown[]).map((child: unknown) => (child as { text?: string }).text || '').join(' ');
		}
		// Récursion pour les autres objets
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

export default async function LandingPage() {
	const [settings, products, branches, posts, team] = await Promise.all([
		sanityClient.fetch(settingsQuery),
		sanityClient.fetch(productsQuery),
		sanityClient.fetch(branchesQuery),
		sanityClient.fetch(postsQuery),
		sanityClient.fetch(teamQuery),
	]);

	// Nettoyer toutes les données Sanity
	const cleanSettings = cleanSanityData(settings) as Record<string, unknown>;
	const cleanProducts = (cleanSanityData(products) as unknown[]) || [];
	const cleanBranches = (cleanSanityData(branches) as unknown[]) || [];
	const cleanPosts = (cleanSanityData(posts) as unknown[]) || [];
	const cleanTeam = (cleanSanityData(team) as unknown[]) || [];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section id="home" className="relative py-20 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-50"></div>
				<div className="container relative">
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<div className="space-y-8 animate-fade-in-up">
							<div className="space-y-4">
								<h1 className="text-5xl lg:text-7xl font-bold leading-tight">
									<span className="gradient-text">SAVET</span>
									<br />
									<span className="text-slate-800">Burkina Faso</span>
								</h1>
								<p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
									{cleanSettings?.hero?.subtitle || "Importateur et distributeur de médicaments vétérinaires, matériel et équipements d&apos;élevage, nutrition animale et solutions de biosécurité."}
								</p>
							</div>
							<div className="flex flex-wrap gap-4">
								{cleanSettings?.hero?.ctaHref && (
									<a href={cleanSettings.hero.ctaHref} className="btn-primary">
										{cleanSettings.hero.ctaLabel || "Découvrir nos services"}
									</a>
								)}
								<a href="#contact" className="btn-secondary">
									Nous contacter
								</a>
							</div>
						</div>
						<div className="animate-slide-in-right">
							{cleanSettings?.hero?.image ? (
								<Image 
									src={urlForImage(cleanSettings.hero.image).width(800).height(600).url()} 
									alt="Hero" 
									width={800} 
									height={600} 
									className="rounded-3xl object-cover w-full h-auto shadow-2xl" 
								/>
							) : (
								<div className="w-full h-96 bg-gradient-to-br from-primary/20 to-emerald-100 rounded-3xl flex items-center justify-center">
									<div className="text-center space-y-4">
										<div className="w-24 h-24 bg-gradient-to-br from-primary to-emerald-600 rounded-full mx-auto flex items-center justify-center">
											<span className="text-white text-3xl font-bold">S</span>
										</div>
										<p className="text-muted-foreground">Image du hero</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section id="about" className="py-20 bg-white">
				<div className="container">
					<div className="section-header">
						<h2 className="section-title">À propos de SAVET</h2>
						<p className="section-subtitle">
							{cleanSettings?.tagline || "Votre partenaire de confiance pour la santé animale au Burkina Faso."}
						</p>
					</div>
					<div className="max-w-4xl mx-auto text-center">
						<div className="card p-8 text-lg leading-relaxed text-muted-foreground">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
								Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Products & Services Section */}
			<section id="products" className="py-20">
				<div className="container">
					<div className="section-header">
						<h2 className="section-title">Produits & Services</h2>
						<p className="section-subtitle">
							Découvrez notre gamme complète de solutions vétérinaires et d&apos;équipements
						</p>
					</div>
					<div className="feature-grid-3">
						{cleanProducts.map((p: unknown, index: number) => (
							<Link 
								href={`/products/${p.slug?.current}`} 
								key={p.slug?.current || index}
								className="block"
							>
								<div className={`card card-hover overflow-hidden hover-lift animate-fade-in-up cursor-pointer`} style={{ animationDelay: `${index * 0.1}s` }}>
									<div className="relative">
										{p.image ? (
											<Image 
												src={urlForImage(p.image).width(600).height(400).url()} 
												alt={p.title || "Produit"} 
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
												{p.isService ? "Service" : "Produit"}
											</span>
										</div>
									</div>
									<div className="p-6 space-y-3">
										<h3 className="text-xl font-semibold text-card-foreground">{p.title || "Titre du produit"}</h3>
										<p className="text-muted-foreground line-clamp-2">{p.description || "Description du produit ou service"}</p>
										<div className="pt-2">
											<span className="text-sm text-primary font-medium">Voir les détails →</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Branches Section */}
			<section id="branches" className="py-20 bg-white">
				<div className="container">
					<div className="section-header">
						<h2 className="section-title">Nos Agences</h2>
						<p className="section-subtitle">
							Retrouvez nos points de vente et agences dans tout le Burkina Faso
						</p>
					</div>
					<div className="feature-grid-2">
						{cleanBranches.map((b: unknown, index: number) => (
							<div key={b.slug?.current || index} className={`card card-hover p-8 hover-lift animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
								<div className="space-y-4">
									<div className="flex items-center space-x-3">
										<div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center">
											<span className="text-white font-bold text-lg">📍</span>
										</div>
										<h3 className="text-2xl font-semibold text-card-foreground">{b.name || "Nom de l&apos;agence"}</h3>
									</div>
									<div className="space-y-2 text-muted-foreground">
										<p className="flex items-center space-x-2">
											<span>📍</span>
											<span>{b.address || "Adresse non spécifiée"}</span>
										</p>
										<p className="flex items-center space-x-2">
											<span>📞</span>
											<span>{b.phone || "Téléphone non spécifié"}</span>
										</p>
									</div>
									{b.mapUrl && (
										<a 
											className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors" 
											href={b.mapUrl} 
											target="_blank"
											rel="noopener noreferrer"
										>
											<span>🗺️</span>
											<span>Voir sur la carte</span>
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section id="team" className="py-20">
				<div className="container">
					<div className="section-header">
						<h2 className="section-title">Équipe & Expertise</h2>
						<p className="section-subtitle">
							Notre équipe de professionnels qualifiés à votre service
						</p>
					</div>
					<div className="feature-grid-3">
						{cleanTeam.map((m: unknown, index: number) => (
							<div key={m.email || m.name || index} className={`card card-hover overflow-hidden hover-lift animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
								<div className="relative">
									{m.photo ? (
										<Image 
											src={urlForImage(m.photo).width(400).height(400).url()} 
											alt={m.name || "Membre de l&apos;équipe"} 
											width={400} 
											height={400} 
											className="w-full h-64 object-cover" 
										/>
									) : (
										<div className="w-full h-64 bg-gradient-to-br from-primary/10 to-emerald-100 flex items-center justify-center">
											<span className="text-4xl">👤</span>
										</div>
									)}
								</div>
								<div className="p-6 text-center space-y-3">
									<h3 className="text-xl font-semibold text-card-foreground">{m.name || "Nom du membre"}</h3>
									<div className="px-4 py-2 bg-primary/10 rounded-full inline-block">
										<span className="text-sm font-medium text-primary">{m.role || "Rôle non spécifié"}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* News Section */}
			<section id="news" className="py-20 bg-white">
				<div className="container">
					<div className="section-header">
						<h2 className="section-title">Actualités</h2>
						<p className="section-subtitle">
							Restez informés des dernières nouvelles et innovations
						</p>
					</div>
					<div className="feature-grid-3">
						{cleanPosts.map((post: unknown, index: number) => (
							<Link 
								href={`/news/${post.slug?.current}`} 
								key={post.slug?.current || index}
								className="block"
							>
								<article className={`card card-hover overflow-hidden hover-lift animate-fade-in-up cursor-pointer`} style={{ animationDelay: `${index * 0.1}s` }}>
									<div className="relative">
										{post.coverImage ? (
											<Image 
												src={urlForImage(post.coverImage).width(600).height(400).url()} 
												alt={post.title || "Article"} 
												width={600} 
												height={400} 
												className="w-full h-48 object-cover" 
											/>
										) : (
											<div className="w-full h-48 bg-gradient-to-br from-primary/10 to-emerald-100 flex items-center justify-center">
												<span className="text-muted-foreground">Image</span>
											</div>
										)}
									</div>
									<div className="p-6 space-y-3">
										<h3 className="text-xl font-semibold text-card-foreground line-clamp-2">{post.title || "Titre de l&apos;article"}</h3>
										<p className="text-muted-foreground line-clamp-3">{post.excerpt || "Extrait de l&apos;article"}</p>
										<div className="pt-2">
											<span className="text-sm text-primary font-medium">Lire l&apos;article complet →</span>
										</div>
									</div>
								</article>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="py-20">
				<div className="container">
					<div className="section-header">
						<h2 className="section-title">Contactez-nous</h2>
						<p className="section-subtitle">
							Notre équipe est là pour répondre à toutes vos questions
						</p>
					</div>
					<div className="grid lg:grid-cols-2 gap-16">
						<div className="space-y-8">
							<div className="card p-8 space-y-6">
								<h3 className="text-2xl font-semibold text-card-foreground">Informations de contact</h3>
								<div className="space-y-4">
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center">
											<span className="text-white text-xl">📧</span>
										</div>
										<div>
											<p className="font-medium">Email</p>
											<a className="text-muted-foreground hover:underline" href={`mailto:${cleanSettings?.contact?.email || "contact@savet.bf"}`}>{cleanSettings?.contact?.email || "contact@savet.bf"}</a>
										</div>
									</div>
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center">
											<span className="text-white text-xl">📞</span>
										</div>
										<div>
											<p className="font-medium">Téléphone</p>
											<a className="text-muted-foreground hover:underline" href={`tel:${cleanSettings?.contact?.phone || "+22664752402"}`}>{cleanSettings?.contact?.phone || "+226 64752402"}</a>
										</div>
									</div>
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center">
											<span className="text-white text-xl">📍</span>
										</div>
										<div>
											<p className="font-medium">Adresse</p>
											<p className="text-muted-foreground">{cleanSettings?.contact?.address || "Burkina Faso"}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="space-y-6">
							{cleanSettings?.contact?.mapUrl ? (
								<div className="card overflow-hidden">
									<iframe 
										className="w-full h-96" 
										src={cleanSettings.contact.mapUrl} 
										loading="lazy"
										title="Carte de localisation"
									/>
								</div>
							) : (
								<div className="card h-96 flex items-center justify-center">
									<div className="text-center space-y-4">
										<div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-emerald-100 rounded-full mx-auto flex items-center justify-center">
											<span className="text-4xl">🗺️</span>
										</div>
										<p className="text-muted-foreground">Carte de localisation</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

