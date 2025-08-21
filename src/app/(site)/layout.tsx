import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAVET Burkina Faso - Solutions Vétérinaires",
  description: "Importateur et distributeur de médicaments vétérinaires, matériel et équipements d'élevage, nutrition animale et solutions de biosécurité.",
};

import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/logosavet.png" type="image/png" />
      </head>
      <body className="antialiased">
        <Navigation />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
  <a href="/">
  <Image src="/logosavet.png" alt="SAVET Logo" width={80} height={80} className="rounded-lg hover:scale-105 transition-transform duration-200" />
</a>
</div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="nav-link">Accueil</a>
            <a href="/#about" className="nav-link">À propos</a>
            <a href="/products" className="nav-link">Produits</a>
            <a href="/#branches" className="nav-link">Agences</a>
            <a href="/#team" className="nav-link">Équipe</a>
            <a href="/news" className="nav-link">Actualités</a>
            <a href="/#contact" className="nav-link">Contact</a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <a href="/#contact" className="btn-primary">
              Nous contacter
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="container py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold gradient-text">SAVET</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Importateur et distributeur de médicaments vétérinaires, matériel et équipements d'élevage, nutrition animale et solutions de biosécurité.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <span className="text-lg">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <span className="text-lg">📷</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <ul className="space-y-3">
              <li><a href="/#about" className="text-slate-300 hover:text-primary transition-colors">À propos</a></li>
              <li><a href="/products" className="text-slate-300 hover:text-primary transition-colors">Produits & Services</a></li>
              <li><a href="/#branches" className="text-slate-300 hover:text-primary transition-colors">Nos Agences</a></li>
              <li><a href="/#team" className="text-slate-300 hover:text-primary transition-colors">Équipe & Expertise</a></li>
              <li><a href="/news" className="text-slate-300 hover:text-primary transition-colors">Actualités</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-3">
              <li className="text-slate-300">Médicaments vétérinaires</li>
              <li className="text-slate-300">Matériel d'élevage</li>
              <li className="text-slate-300">Équipements vétérinaires</li>
              <li className="text-slate-300">Nutrition animale</li>
              <li className="text-slate-300">Solutions de biosécurité</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-primary">📧</span>
                <span className="text-slate-300">contact@savet.bf</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary">📞</span>
                <span className="text-slate-300">+226 64752402</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary">📍</span>
                <span className="text-slate-300">Burkina Faso</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} SAVET Burkina Faso. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">Mentions légales</a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">Politique de confidentialité</a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">Conditions d'utilisation</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

