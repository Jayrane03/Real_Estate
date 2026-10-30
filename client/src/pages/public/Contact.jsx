import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PublicFooter, PublicHeader } from "../../components/Common.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useSiteContent } from "../../contexts/SiteContentContext.jsx";

export function ContactPage() {
  const { siteContent } = useSiteContent();
  const { contact } = siteContent;
  usePageMeta("Private enquiry", contact.description, siteContent.brandName);
  return (
    <div className="public-site">
      <PublicHeader />
      <main className="contact-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Return to the residences
        </Link>
        <div>
          <span className="eyebrow">{contact.eyebrow}</span>
          <h1>
            {contact.heading}
            <br />
            <em>{contact.highlight}</em>
          </h1>
          <p>{contact.description}</p>
          <a className="button button-dark" href="/#contact">
            {contact.submitLabel} <ArrowRight size={15} />
          </a>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
