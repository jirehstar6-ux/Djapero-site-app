import { Leaf, Facebook, Instagram, Phone as WhatsApp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer mt-auto">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2 className="flex items-center gap-2">
                            <Leaf className="text-secondary" /> Djapero
                        </h2>
                        <p>La nature livrée chez vous, et votre image sublimée.</p>
                    </div>
                    <div className="footer-links">
                        <Link to="/">Accueil</Link>
                        <Link to="/produits">Produits</Link>
                        <Link to="/livraison">Livraison</Link>
                        <Link to="/services">Services</Link>
                    </div>
                    <div className="footer-socials">
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><WhatsApp size={20} /></a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Djapero. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
