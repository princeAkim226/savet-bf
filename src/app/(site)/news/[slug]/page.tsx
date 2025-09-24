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
	const post = await sanityClient.fetch(`
		*[_type == "post" && slug.current == $slug][0]{
			title, excerpt
		}
	`, { slug });

	if (!post) {
		return {
			title: 'Article non trouvé',
		};
	}

	return {
		title: `${post.title} - SAVET Burkina Faso`,
		description: post.excerpt || 'Article d&apos;actualité SAVET',
	};
}

// Générer les paramètres statiques
export async function generateStaticParams() {
	const posts = await sanityClient.fetch(`
		*[_type == "post"]{
			slug
		}
	`);

	return posts.map((post: { slug: { current: string } }) => ({
		slug: post.slug.current,
	}));
}

export default async function NewsPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
	const post = await sanityClient.fetch(`
		*[_type == "post" && slug.current == $slug][0]{
			title, excerpt, coverImage, publishedAt, author, content
		}
	`, { slug });

	if (!post) {
		notFound();
	}

	const cleanPost = cleanSanityData(post) as Record<string, unknown>;

	// Formater la date
	const formatDate = (dateString: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

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
						<Link href="/news" className="hover:text-primary transition-colors">
							Actualités
						</Link>
						<span>/</span>
						<span className="text-foreground">{cleanPost.title}</span>
					</nav>
				</div>
			</div>

			{/* Article Header */}
			<section className="py-16 bg-gradient-to-br from-primary/5 to-emerald-50">
				<div className="container">
					<div className="max-w-4xl mx-auto text-center space-y-6">
						<div className="inline-flex items-center space-x-2">
							<span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
								Actualité
							</span>
							{cleanPost.publishedAt && (
								<span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
									{formatDate(cleanPost.publishedAt)}
								</span>
							)}
						</div>
						<h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
							{cleanPost.title}
						</h1>
						{cleanPost.excerpt && (
							<p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
								{cleanPost.excerpt}
							</p>
						)}
						{cleanPost.author && (
							<div className="flex items-center space-x-2 text-muted-foreground">
								<span>Par</span>
								<span className="font-medium">{cleanPost.author}</span>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Article Content */}
			<section className="py-20">
				<div className="container">
					<div className="grid lg:grid-cols-3 gap-16">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-8">
							{/* Cover Image */}
							{cleanPost.coverImage && (
								<div className="card overflow-hidden">
									<Image 
										src={urlForImage(cleanPost.coverImage).width(800).height(400).url()} 
										alt={cleanPost.title} 
										width={800} 
										height={400} 
										className="w-full h-auto object-cover" 
									/>
								</div>
							)}

							{/* Article Text */}
							<div className="card p-8">
								{cleanPost.content ? (
									<div className="prose prose-lg max-w-none">
										{cleanPost.content}
									</div>
								) : (
									<div className="space-y-6">
										<p className="text-muted-foreground leading-relaxed">
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
											Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
										</p>
										<p className="text-muted-foreground leading-relaxed">
											Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
											Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
										</p>
										<p className="text-muted-foreground leading-relaxed">
											Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
											totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
										</p>
									</div>
								)}
							</div>

							{/* Article Footer */}
							<div className="card p-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<span className="text-muted-foreground">Partager cet article :</span>
										<div className="flex space-x-2">
											<a href="#" className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors">
												📘
											</a>
											<a href="#" className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors">
												🐦
											</a>
											<a href="#" className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors">
												📧
											</a>
										</div>
									</div>
									{cleanPost.publishedAt && (
										<span className="text-sm text-muted-foreground">
											Publié le {formatDate(cleanPost.publishedAt)}
										</span>
									)}
								</div>
							</div>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Author Info */}
							{cleanPost.author && (
								<div className="card p-6">
									<h3 className="text-lg font-semibold mb-4">À propos de l&apos;auteur</h3>
									<div className="text-center space-y-3">
										<div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-full mx-auto flex items-center justify-center">
											<span className="text-white text-xl font-bold">
												{cleanPost.author.charAt(0).toUpperCase()}
											</span>
										</div>
										<div>
											<p className="font-medium">{cleanPost.author}</p>
											<p className="text-sm text-muted-foreground">Rédacteur SAVET</p>
										</div>
									</div>
								</div>
							)}

							{/* Related Articles */}
							<div className="card p-6">
								<h3 className="text-lg font-semibold mb-4">Articles similaires</h3>
								<div className="space-y-3">
									<p className="text-sm text-muted-foreground">
										Découvrez d&apos;autres actualités et articles de SAVET.
									</p>
									<Link href="/news" className="btn-secondary w-full text-center">
										Voir toutes les actualités
									</Link>
								</div>
							</div>

							{/* Contact CTA */}
							<div className="card p-6 text-center">
								<h3 className="text-lg font-semibold mb-4">Questions ?</h3>
								<p className="text-muted-foreground mb-6">
									Contactez-nous pour plus d&apos;informations sur nos services.
								</p>
								<Link href="/#contact" className="btn-primary w-full">
									Nous contacter
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
} 