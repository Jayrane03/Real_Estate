import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowDownRight, ArrowRight, Check, ChevronLeft, ChevronRight, Mail, Phone, Search, ShieldCheck } from "lucide-react";
import api from "../../lib/helper.js";
import { Button, Field, PropertyCard, PublicFooter, PublicHeader } from "../../components/Common.jsx";
import { cover, propertyFallbacks } from "../../lib/site.js";
import { inquirySchema } from "../../lib/validation.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useSiteContent } from "../../contexts/SiteContentContext.jsx";
import "./residence-slider.css";

export function PublicHome() {
  const { siteContent } = useSiteContent();
  const { hero, story, residences, gallery, amenities, contact } = siteContent;
  const residenceSlider = useRef(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  usePageMeta(siteContent.seo.title, siteContent.seo.description, siteContent.brandName, true);
  const [properties, setProperties] = useState(propertyFallbacks);
  const [search, setSearch] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const form = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });
  useEffect(() => {
    api
      .get("/properties", { params: { limit: 50 } })
      .then(({ data }) => {
        if (data.items?.length) setProperties(data.items);
      })
      .catch(() => {});
  }, []);
  const visible = properties.filter((item) =>
    `${item.title} ${item.neighborhood || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  useEffect(() => {
    const slider = residenceSlider.current;
    if (!slider) return undefined;

    const updateControls = () => {
      setCanScrollBack(slider.scrollLeft > 0);
      setCanScrollForward(slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 1);
    };

    updateControls();
    slider.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      slider.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [visible.length]);
  const scrollResidences = (direction) => {
    const slider = residenceSlider.current;
    if (!slider) return;
    slider.scrollBy({
      left: direction * slider.clientWidth * 0.85,
      behavior: "smooth",
    });
  };
  const submit = async (values) => {
    setSending(true);
    try {
      await api.post("/inquiries", values);
      setSent(true);
      form.reset();
    } catch (err) {
      form.setError("root", {
        message:
          err.response?.data?.message ||
          "The enquiry could not be sent. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="public-site">
      <PublicHeader />
      <main>
        <section className="hero" style={{ "--hero-image": `url("${siteContent.heroImage || cover}")` }}>
          <div className="hero-copy">
            <span className="eyebrow eyebrow-light">
              <i /> {hero.eyebrow}
            </span>
            <h1>
              {hero.title}
              <br />
              <em>{hero.highlight}</em>
            </h1>
            <p>
              {hero.description}
              <br />
              {hero.secondaryLine}
            </p>
            <a className="hero-link" href="#residences">
              {hero.cta} <ArrowDownRight size={16} />
            </a>
          </div>
          <div className="hero-side">
            <span>{hero.coordinates}</span>
            <span className="hero-side-rule" />
            <span>{hero.location}</span>
          </div>
          <div className="hero-bottom">
            <span>{hero.counter}</span>
            <span className="hero-bottom-line" />
            <span>{hero.collection}</span>
            <span className="hero-scroll">{hero.scrollLabel}</span>
          </div>
        </section>
        <section className="intro-section" id="story">
          <div className="section-index">
            {story.index}
          </div>
          <div className="intro-content">
            <p className="eyebrow">{story.eyebrow}</p>
            <h2>
              {story.heading}
              <br />
              <em>{story.highlight}</em>
            </h2>
            <div className="intro-columns">
              <p>{story.body}</p>
              <div className="intro-note">
                <span>{story.addressLabel}</span>
                <p style={{ whiteSpace: "pre-line" }}>{story.address}</p>
                <a href="#contact">
                  {story.cta} <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="residences-section" id="residences">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{residences.eyebrow}</p>
              <h2>
                {residences.heading} <em>{residences.highlight}</em>
              </h2>
            </div>
            <div className="residence-tools">
              <div className="listing-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={residences.searchPlaceholder}
                  aria-label="Search residences"
                />
              </div>
              <div className="residence-slider-controls">
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => scrollResidences(-1)}
                  disabled={!canScrollBack}
                  aria-label="Previous residences"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => scrollResidences(1)}
                  disabled={!canScrollForward}
                  aria-label="Next residences"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
          <div className="residence-grid" ref={residenceSlider}>
            {visible.map((home, index) => (
              <PropertyCard
                key={home._id || home.slug}
                property={home}
                index={index}
              />
            ))}
          </div>
          {visible.length === 0 && (
            <p className="empty-state">No residences match that search.</p>
          )}
          <a className="text-link" href="#contact">
            {residences.cta} <ArrowRight size={15} />
          </a>
        </section>
        <section className="feature-image" id="gallery" style={{ backgroundImage: `linear-gradient(90deg,rgba(24,18,14,.32),rgba(24,18,14,.04)),url("${gallery.image || cover}")` }}>
          <div className="feature-image-caption">
            <span>{gallery.eyebrow}</span>
            <p>
              {gallery.heading}
              <br />
              <em>{gallery.highlight}</em>
            </p>
            <span>{gallery.linkLabel}</span>
          </div>
        </section>
        <section className="amenities-section" id="amenities">
          <div className="section-index">
            {amenities.index}
          </div>
          <div className="amenities-content">
            <p className="eyebrow">{amenities.eyebrow}</p>
            <h2>
              {amenities.heading}
              <br />
              <em>{amenities.highlight}</em>
            </h2>
            <div className="amenity-list">
              {Array.from({ length: Math.ceil(amenities.items.length / 2) }, (_, index) => amenities.items.slice(index * 2, index * 2 + 2)).map((row, index) => (
                <div key={index}>
                  {row.map((item) => (
                    <span key={item.number}>{item.number}</span>
                  ))}
                  {row.map((item) => (
                    <b key={item.number}>{item.name}</b>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="contact-copy">
            <p className="eyebrow eyebrow-light">{contact.eyebrow}</p>
            <h2>
              {contact.heading}
              <br />
              <em>{contact.highlight}</em>
            </h2>
            <p>{contact.description}</p>
            <div className="contact-direct">
              <span>
                <Phone size={15} /> {siteContent.phone}
              </span>
              <span>
                <Mail size={15} /> {siteContent.contactEmail}
              </span>
            </div>
          </div>
          <div className="contact-form-wrap">
            {sent ? (
              <div className="form-success">
                <span>
                  <Check size={22} />
                </span>
                <h3>{contact.successHeading}</h3>
                <p>{contact.successMessage}</p>
                <button className="text-link" onClick={() => setSent(false)}>
                  Send another enquiry <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={form.handleSubmit(submit)}
              >
                <span className="eyebrow">{contact.formEyebrow}</span>
                <h3>{contact.formHeading}</h3>
                <Field
                  label="Full name"
                  error={form.formState.errors.name?.message}
                >
                  <input placeholder="Your name" {...form.register("name")} />
                </Field>
                <div className="form-row">
                  <Field
                    label="Email address"
                    error={form.formState.errors.email?.message}
                  >
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...form.register("email")}
                    />
                  </Field>
                  <Field label="Phone number">
                    <input placeholder="+91" {...form.register("phone")} />
                  </Field>
                </div>
                <Field
                  label="A note for our team"
                  error={form.formState.errors.message?.message}
                >
                  <textarea
                    rows="3"
                    placeholder="I'm interested in learning more about..."
                    {...form.register("message")}
                  />
                </Field>
                {form.formState.errors.root && (
                  <small className="field-error">
                    {form.formState.errors.root.message}
                  </small>
                )}
                <Button type="submit" disabled={sending}>
                  {sending ? "Sending…" : contact.submitLabel}{" "}
                  <ArrowRight size={15} />
                </Button>
                <small className="privacy-note">
                  <ShieldCheck size={13} /> {contact.privacyNote}
                </small>
              </form>
            )}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
