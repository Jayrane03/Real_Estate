import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import api from "../../lib/helper.js";
import { PublicFooter, PublicHeader } from "../../components/Common.jsx";
import { cover, propertyFallbacks } from "../../lib/site.js";
import { formatPrice } from "../../lib/format.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useSiteContent } from "../../contexts/SiteContentContext.jsx";

export function PropertyDetail() {
  const { slug } = useParams();
  const { siteContent } = useSiteContent();
  const { propertyDetail: copy } = siteContent;
  const [property, setProperty] = useState(
    propertyFallbacks.find((item) => item.slug === slug),
  );
  const [error, setError] = useState(false);
  useEffect(() => {
    api
      .get(`/properties/${slug}`)
      .then(({ data }) => setProperty(data))
      .catch(() => setError(true));
  }, [slug]);
  usePageMeta(
    property?.seo?.title || property?.title,
    property?.seo?.description || property?.excerpt,
    siteContent.brandName,
  );
  if (error && !property)
    return (
      <>
        <PublicHeader />
        <main className="not-found">
          <h1>Residence not found</h1>
          <Link to="/">
            Return to Aurelia <ArrowRight size={15} />
          </Link>
        </main>
        <PublicFooter />
      </>
    );
  if (!property)
    return (
      <div className="loading-screen">
        AURELIA <span>Loading residence…</span>
      </div>
    );
  return (
    <div className="public-site">
      <PublicHeader />
      <main>
        <section
          className="detail-hero"
          style={{
            backgroundImage: `linear-gradient(90deg,rgba(24,18,14,.62),transparent),url("${property.coverImage || cover}")`,
          }}
        >
          <Link to="/" className="detail-back">
            <ArrowLeft size={15} /> {copy.backLabel}
          </Link>
          <div>
            <p className="eyebrow eyebrow-light">
              {property.neighborhood || "WORLI · MUMBAI"}
            </p>
            <h1>{property.title}</h1>
            <p>{property.address}</p>
          </div>
        </section>
        {property.gallery?.filter(Boolean).length > 0 && (
          <section
            aria-label="Residence gallery"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              padding: "32px 8%",
            }}
          >
            {property.gallery.filter(Boolean).map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${property.title} gallery ${index + 1}`}
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }}
              />
            ))}
          </section>
        )}
        <section className="detail-content">
          <div className="detail-main">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2>
              {copy.heading}
              <br />
              <em>{copy.highlight}</em>
            </h2>
            <p>
              {property.description ||
                property.excerpt ||
                "Thoughtfully planned interiors, considered materials, and a view that changes with the light. Discover a more personal expression of city living."}
            </p>
            {property.amenities?.length > 0 && (
              <>
                <p className="eyebrow detail-subhead">{copy.amenitiesLabel}</p>
                <div className="detail-amenities">
                  {property.amenities.map((amenity) => (
                    <span key={amenity.name}>
                      <Check size={15} /> {amenity.name}
                    </span>
                  ))}
                </div>
              </>
            )}
            {property.floorPlans?.length > 0 && (
              <div className="floor-plan-list">
                <p className="eyebrow detail-subhead">{copy.floorPlansLabel}</p>
                {property.floorPlans.map((plan) => (
                  <div key={plan._id || plan.name}>
                    {plan.image && (
                      <img
                        src={plan.image}
                        alt={`${plan.name} floor plan`}
                        loading="lazy"
                        style={{ width: "88px", aspectRatio: "4 / 3", objectFit: "cover" }}
                      />
                    )}
                    <span>{plan.name}</span>
                    <span>
                      {plan.beds} BED · {plan.baths} BATH
                    </span>
                    <b>{Number(plan.area).toLocaleString("en-IN")} SQ.FT</b>
                  </div>
                ))}
              </div>
            )}
          </div>
          <aside className="detail-aside">
            <span className="eyebrow">{copy.asideEyebrow}</span>
            <h3>
              {copy.asideHeading}
              <br />
              <em>{copy.asideHighlight}</em>
            </h3>
            <p>{copy.asideDescription}</p>
            <Link to="/contact" className="button button-dark">
              {copy.asideCta} <ArrowRight size={15} />
            </Link>
            <div className="detail-aside-price">
              {copy.startingAtLabel} <b>{formatPrice(property.price)}</b>
            </div>
          </aside>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
