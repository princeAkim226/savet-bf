import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";

// Fonction pour nettoyer les données Sanity
function cleanSanityData(data: any): any {
	if (Array.isArray(data)) {
		return data.map(cleanSanityData);
	}
	if (data && typeof data === 'object') {
		if (data._type === 'block' && data.children) {
			return data.children.map((child: any) => child.text || '').join(' ');
		}
		const cleaned: any = {};
		for (const key in data) {
			if (key !== '_type' && key !== '_key' && key !== 'markDefs' && key !== 'style') {
				cleaned[key] = cleanSanityData(data[key]);
			}
		}
		return cleaned;
	}
	return data;
}

export const metadata = {
	title: 'Actualités - SAVET Burkina Faso',
	description: 'Restez informés des dernières nouvelles et innovations de SAVET',
};

export default async function NewsPage() {
	const posts = await sanityClient.fetch(`
		*[_type == "post"]|order(publishedAt desc){
			title, slug, excerpt, coverImage, publishedAt, author
		}
	`);

	const cleanPosts = cleanSanityData(posts) || [];

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
			{/* Header */}
			<section className="py-16 bg-gradient-to-br from-primary/5 to-emerald-50">
				<div className="container">
					<div className="text-center space-y-6">
						<h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
							Actualités & Articles
						</h1>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Restez informés des dernières nouvelles, innovations et actualités 
							du monde vétérinaire et de SAVET Burkina Faso.
						</p>
					</div>
				</div>
			</section>

			{/* News List */}
			<section className="py-20">
				<div className="container">
					{cleanPosts.length > 0 ? (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{cleanPosts.map((post: any, index: number) => (
								<Link 
									href={`/news/${post.slug?.current}`} 
									key={post.slug?.current || index}
									className="block"
								>
									<article className="card card-hover overflow-hidden hover-lift cursor-pointer h-full">
										<div className="relative">
											{post.coverImage ? (
												<Image 
													src={urlForImage(post.coverImage).width(600).height(400).url()} 
													alt={post.title} 
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
													Actualité
												</span>
											</div>
											{post.publishedAt && (
												<div className="absolute bottom-4 right-4">
													<span className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-slate-800">
														{formatDate(post.publishedAt)}
													</span>
												</div>
											)}
										</div>
										<div className="p-6 space-y-3 flex-1">
											<h3 className="text-xl font-semibold text-card-foreground line-clamp-2">{post.title}</h3>
											<p className="text-muted-foreground line-clamp-3">{post.excerpt || "Extrait de l'article"}</p>
											{post.author && (
												<div className="pt-2 text-sm text-muted-foreground">
													Par <span className="font-medium">{post.author}</span>
												</div>
											)}
											<div className="pt-4">
												<span className="text-sm text-primary font-medium">Lire l'article complet →</span>
											</div>
										</div>
									</article>
								</Link>
							))}
						</div>
					) : (
						<div className="text-center py-20">
							<div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-emerald-100 rounded-full mx-auto flex items-center justify-center mb-6">
								<span className="text-4xl">📰</span>
							</div>
							<h3 className="text-2xl font-semibold text-slate-800 mb-4">
								Aucune actualité pour le moment
							</h3>
							<p className="text-muted-foreground mb-8">
								Revenez bientôt pour découvrir nos dernières nouvelles et articles.
							</p>
							<Link href="/" className="btn-primary">
								Retour à l'accueil
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* Newsletter CTA */}
			<section className="py-20 bg-white">
				<div className="container">
					<div className="text-center space-y-8">
						<h2 className="text-3xl font-bold text-slate-800">
							Restez informés
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Recevez nos dernières actualités et offres spéciales directement dans votre boîte mail.
						</p>
						<div className="max-w-md mx-auto">
							<div className="flex space-x-2">
								<input 
									type="email" 
									placeholder="Votre email" 
									className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								/>
								<button className="btn-primary whitespace-nowrap">
									S'abonner
								</button>
							</div>
						</div>
						<div className="flex flex-wrap gap-4 justify-center">
							<Link href="/#contact" className="btn-secondary">
								Nous contacter
							</Link>
							<Link href="/" className="btn-secondary">
								Retour à l'accueil
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
} 