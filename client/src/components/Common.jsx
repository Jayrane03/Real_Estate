import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Bath, BedDouble, ChevronRight, MapPin, Menu, Phone, ShieldCheck, X } from "lucide-react";
import api from "../lib/api.js";
import { cover, propertyFallbacks } from "../lib/site.js";
import { formatPrice } from "../lib/format.js";
import { useSiteContent } from "../contexts/SiteContentContext.jsx";

export function Field({ label, error, children, className = "" }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

export function Button({ children, variant = "dark", className = "", ...props }) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { siteContent } = useSiteContent();
  return (
    <>
      <div className="notice-bar">
        <MapPin size={13} /> {siteContent.notice.location}{" "}
        <span className="notice-divider" /> {siteContent.notice.registration}{" "}
        <a href={`tel:${siteContent.phone.replace(/[^\d+]/g, "")}`}>
          <Phone size={13} /> {siteContent.notice.conciergeLabel} {siteContent.phone}
        </a>
      </div>
      <header className="public-header">
        <Link to="/" className="brand">
          <span className="brand-mark">A</span>
          <span>
            <b>{siteContent.brandName}</b>
            <small>{siteContent.brandDescriptor}</small>
          </span>
        </Link>
        <button
          className="icon-button mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "public-nav nav-open" : "public-nav"}>
          <a href="/#residences" onClick={() => setMenuOpen(false)}>
            {siteContent.navigation.residences}
          </a>
          <a href="/#story" onClick={() => setMenuOpen(false)}>
            {siteContent.navigation.address}
          </a>
          <a href="/#amenities" onClick={() => setMenuOpen(false)}>
            {siteContent.navigation.amenities}
          </a>
          <a href="/#gallery" onClick={() => setMenuOpen(false)}>
            {siteContent.navigation.gallery}
          </a>
          <Link className="nav-enquire" to="/contact">
            {siteContent.navigation.enquire} <ArrowUpRight size={14} />
          </Link>
        </nav>
      </header>
    </>
  );
}

export function PublicFooter() {
  const { siteContent } = useSiteContent();
  return (
    <footer className="public-footer">
      <Link to="/" className="brand">
        <span className="brand-mark">A</span>
        <span>
          <b>{siteContent.brandName}</b>
          <small>{siteContent.brandDescriptor}</small>
        </span>
      </Link>
      <p>{siteContent.footer.address} · {siteContent.footer.registration}</p>
      <Link to="/admin/sign-in" className="footer-admin">
        <ShieldCheck size={14} /> Admin portal
      </Link>
    </footer>
  );
}

export function PropertyCard({ property, index = 0 }) {
  const image =
    property.coverImage ||
    property.gallery?.[0] ||
    propertyFallbacks[index % propertyFallbacks.length].coverImage;
  return (
    <Link to={`/residences/${property.slug}`} className="property-card">
      <div className="property-image">
        <img src={image} alt={property.title} loading="lazy" />
        <span className="property-number">0{index + 1}</span>
        <span className="property-open">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="property-card-info">
        <div>
          <p className="eyebrow">{property.neighborhood || "WORLI · MUMBAI"}</p>
          <h3>{property.title}</h3>
        </div>
        <span className="property-price">{formatPrice(property.price)}</span>
      </div>
      <div className="property-specs">
        <span>
          <BedDouble size={14} /> {property.beds || 0} BED
        </span>
        <span>
          <Bath size={14} /> {property.baths || 0} BATH
        </span>
        <span>{Number(property.area || 0).toLocaleString("en-IN")} SQ.FT</span>
      </div>
    </Link>
  );
}

export function AdminGate({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);
  if (checking)
    return (
      <div className="loading-screen">
        AURELIA <span>Verifying secure access…</span>
      </div>
    );
  if (!user) return <Navigate to="/admin/sign-in" replace />;
  return children(user);
}

export function PageTitle({ eyebrow, title, description, actions }) {
  return (
    <div className="admin-page-title">
      <div>
        <div className="breadcrumb">
          DASHBOARD <ChevronRight size={12} /> {eyebrow.toUpperCase()}
        </div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, note, change, tone = "gold" }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon icon-${tone}`}>
          <Icon size={17} />
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">
        <span className="stat-note">{note}</span>
        {change && (
          <span className="stat-change">
            <ArrowUpRight size={13} />
            {change}
          </span>
        )}
      </div>
    </article>
  );
}

export function StatusTag({ status }) {
  const value = status || "draft";
  const label =
    value === "published"
      ? "Live"
      : value === "new"
        ? "New"
        : value === "contacted"
          ? "Contacted"
          : value === "closed"
            ? "Closed"
            : "Draft";
  return <span className={`status-tag status-${value}`}>{label}</span>;
}

export function NotFound() {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <Link to="/">
        Return to Aurelia <ArrowRight size={15} />
      </Link>
    </div>
  );
}
