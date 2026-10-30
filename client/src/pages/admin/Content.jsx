import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Eye, FileText, Image, ListPlus, MapPin, Phone, Search, ShieldCheck, Trash2, X } from "lucide-react";
import api from "../../lib/api.js";
import { Button, Field, PageTitle } from "../../components/Common.jsx";
import { DEFAULT_SITE_CONTENT, useSiteContent } from "../../contexts/SiteContentContext.jsx";
import { contentSchema } from "../../lib/validation.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

const contentGroups = [
  {
    eyebrow: "BRAND & NAVIGATION",
    title: "Project identity",
    icon: Image,
    fields: [
      { name: "brandName", label: "Project name" },
      { name: "brandDescriptor", label: "Brand descriptor" },
      { name: "navigation.residences", label: "Residences navigation label" },
      { name: "navigation.address", label: "Address navigation label" },
      { name: "navigation.amenities", label: "Amenities navigation label" },
      { name: "navigation.gallery", label: "Gallery navigation label" },
      { name: "navigation.enquire", label: "Enquiry navigation label" },
    ],
  },
  {
    eyebrow: "ANNOUNCEMENT BAR",
    title: "Location and registration",
    icon: MapPin,
    fields: [
      { name: "notice.location", label: "Location" },
      { name: "notice.registration", label: "Registration text" },
      { name: "notice.conciergeLabel", label: "Phone label" },
      { name: "phone", label: "Concierge telephone" },
    ],
  },
  {
    eyebrow: "FIRST IMPRESSION",
    title: "Hero section",
    icon: Image,
    fields: [
      { name: "hero.eyebrow", label: "Eyebrow" },
      { name: "hero.title", label: "Headline first line" },
      { name: "hero.highlight", label: "Headline emphasized line" },
      { name: "hero.description", label: "Description" },
      { name: "hero.secondaryLine", label: "Supporting line" },
      { name: "hero.cta", label: "Call to action" },
      { name: "hero.coordinates", label: "Coordinates" },
      { name: "hero.location", label: "Location label" },
      { name: "hero.counter", label: "Slide counter" },
      { name: "hero.collection", label: "Collection label" },
      { name: "hero.scrollLabel", label: "Scroll label" },
      { name: "heroImage", label: "Hero image URL", type: "url" },
    ],
  },
  {
    eyebrow: "PROJECT STORY",
    title: "Address and story",
    icon: FileText,
    fields: [
      { name: "story.index", label: "Section index" },
      { name: "story.eyebrow", label: "Eyebrow" },
      { name: "story.heading", label: "Heading" },
      { name: "story.highlight", label: "Emphasized heading" },
      { name: "story.body", label: "Story copy", multiline: true },
      { name: "story.addressLabel", label: "Address label" },
      { name: "story.address", label: "Address", multiline: true },
      { name: "story.cta", label: "Call to action" },
    ],
  },
  {
    eyebrow: "PROPERTY COLLECTION",
    title: "Residence section",
    icon: FileText,
    fields: [
      { name: "residences.eyebrow", label: "Eyebrow" },
      { name: "residences.heading", label: "Heading" },
      { name: "residences.highlight", label: "Emphasized heading" },
      { name: "residences.searchPlaceholder", label: "Search placeholder" },
      { name: "residences.cta", label: "Call to action" },
    ],
  },
  {
    eyebrow: "RESIDENCE DETAILS",
    title: "Property detail page",
    icon: FileText,
    fields: [
      { name: "propertyDetail.backLabel", label: "Back link label" },
      { name: "propertyDetail.eyebrow", label: "Section eyebrow" },
      { name: "propertyDetail.heading", label: "Heading" },
      { name: "propertyDetail.highlight", label: "Emphasized heading" },
      { name: "propertyDetail.amenitiesLabel", label: "Amenities heading" },
      { name: "propertyDetail.floorPlansLabel", label: "Floor plans heading" },
      { name: "propertyDetail.asideEyebrow", label: "Viewing panel eyebrow" },
      { name: "propertyDetail.asideHeading", label: "Viewing panel heading" },
      { name: "propertyDetail.asideHighlight", label: "Viewing panel emphasized heading" },
      { name: "propertyDetail.asideDescription", label: "Viewing panel description", multiline: true },
      { name: "propertyDetail.asideCta", label: "Viewing button label" },
      { name: "propertyDetail.startingAtLabel", label: "Starting price label" },
    ],
  },
  {
    eyebrow: "GALLERY",
    title: "Gallery section",
    icon: Image,
    fields: [
      { name: "gallery.eyebrow", label: "Eyebrow" },
      { name: "gallery.heading", label: "Heading" },
      { name: "gallery.highlight", label: "Emphasized heading" },
      { name: "gallery.linkLabel", label: "Gallery label" },
      { name: "gallery.image", label: "Gallery image URL", type: "url" },
    ],
  },
  {
    eyebrow: "AMENITIES",
    title: "Private by design",
    icon: FileText,
    fields: [
      { name: "amenities.index", label: "Section index" },
      { name: "amenities.eyebrow", label: "Eyebrow" },
      { name: "amenities.heading", label: "Heading" },
      { name: "amenities.highlight", label: "Emphasized heading" },
    ],
  },
  {
    eyebrow: "PRIVATE ENQUIRIES",
    title: "Contact section",
    icon: Phone,
    fields: [
      { name: "contact.eyebrow", label: "Eyebrow" },
      { name: "contact.heading", label: "Heading" },
      { name: "contact.highlight", label: "Emphasized heading" },
      { name: "contact.description", label: "Description", multiline: true },
      { name: "contact.formEyebrow", label: "Form eyebrow" },
      { name: "contact.formHeading", label: "Form heading" },
      { name: "contact.submitLabel", label: "Submit button label" },
      { name: "contact.successHeading", label: "Success heading" },
      { name: "contact.successMessage", label: "Success message", multiline: true },
      { name: "contact.privacyNote", label: "Privacy note" },
      { name: "contactEmail", label: "Concierge email", type: "email" },
    ],
  },
  {
    eyebrow: "FOOTER & SEARCH",
    title: "Footer and SEO metadata",
    icon: Search,
    fields: [
      { name: "footer.address", label: "Footer address" },
      { name: "footer.registration", label: "Footer registration" },
      { name: "seo.title", label: "Search title" },
      { name: "seo.description", label: "Meta description", multiline: true },
      { name: "seo.keywords", label: "Keywords" },
    ],
  },
];

function getFieldError(errors, name) {
  return name
    .split(".")
    .reduce((current, key) => current?.[key], errors)?.message;
}

export function ContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const { refresh } = useSiteContent();
  const form = useForm({
    resolver: zodResolver(contentSchema),
    defaultValues: DEFAULT_SITE_CONTENT,
  });
  const amenityFields = useFieldArray({
    control: form.control,
    name: "amenities.items",
  });
  usePageMeta("Site content");
  useEffect(() => {
    api
      .get("/admin/content")
      .then(({ data }) => form.reset(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const submit = async (values) => {
    setSaving(true);
    setNotice("");
    try {
      await api.put("/admin/content", {
        ...values,
        headline: `${values.hero.title} ${values.hero.highlight}`,
        subheadline: `${values.hero.description} ${values.hero.secondaryLine}`,
      });
      await refresh();
      setNotice("Your site content is saved and published.");
    } catch (err) {
      setNotice(err.response?.data?.message || "Unable to save site content.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="CMS settings"
        title="Site content & SEO"
        description="Manage your public site identity, enquiry details, and search metadata."
        actions={
          <Link className="button button-light" to="/" target="_blank">
            <Eye size={15} /> Preview site
          </Link>
        }
      />
      {loading ? (
        <div className="loading-inline">Loading CMS content…</div>
      ) : (
        <form onSubmit={form.handleSubmit(submit)} className="content-editor">
          {contentGroups.map(({ eyebrow, title, icon: Icon, fields }) => (
            <section className="panel content-panel" key={title}>
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">{eyebrow}</p>
                  <h2>{title}</h2>
                </div>
                <Icon size={18} className="panel-heading-icon" />
              </div>
              <div className="content-fields">
                {fields.map(({ name, label, type, multiline }) => (
                  <Field
                    key={name}
                    label={label}
                    error={getFieldError(form.formState.errors, name)}
                  >
                    {multiline ? (
                      <textarea rows="3" {...form.register(name)} />
                    ) : (
                      <input type={type || "text"} {...form.register(name)} />
                    )}
                  </Field>
                ))}
                {title === "Project identity" && (
                  <div className="content-preview">
                    <img
                      src={form.watch("heroImage")}
                      alt="Hero preview"
                      onError={(event) => {
                        event.currentTarget.style.opacity = "0.2";
                      }}
                    />
                    <span>HERO IMAGE PREVIEW</span>
                  </div>
                )}
                {title === "Gallery section" && (
                  <div className="content-preview">
                    <img
                      src={form.watch("gallery.image")}
                      alt="Gallery preview"
                      onError={(event) => {
                        event.currentTarget.style.opacity = "0.2";
                      }}
                    />
                    <span>GALLERY IMAGE PREVIEW</span>
                  </div>
                )}
                {title === "Private by design" && (
                  <div className="amenity-editor-list">
                    {amenityFields.fields.map((field, index) => (
                      <div className="amenity-editor-row" key={field.id}>
                        <Field label={`Number ${index + 1}`}>
                          <input {...form.register(`amenities.items.${index}.number`)} />
                        </Field>
                        <Field
                          label={`Amenity ${index + 1}`}
                          error={form.formState.errors.amenities?.items?.[index]?.name?.message}
                        >
                          <input {...form.register(`amenities.items.${index}.name`)} />
                        </Field>
                        <button
                          className="row-action danger-action"
                          type="button"
                          onClick={() => amenityFields.remove(index)}
                          aria-label={`Remove amenity ${index + 1}`}
                          disabled={amenityFields.fields.length === 1}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="button button-light"
                      type="button"
                      onClick={() => amenityFields.append({
                        number: String(amenityFields.fields.length + 1).padStart(2, "0"),
                        name: "",
                      })}
                      disabled={amenityFields.fields.length >= 12}
                    >
                      <ListPlus size={15} /> Add amenity
                    </button>
                  </div>
                )}
                {title === "Footer and SEO metadata" && (
                  <div className="seo-preview">
                    <span>SEARCH RESULT PREVIEW</span>
                    <b>{form.watch("seo.title")}</b>
                    <small>aureliaresidences.com</small>
                    <p>{form.watch("seo.description")}</p>
                  </div>
                )}
              </div>
            </section>
          ))}
          <div className="content-savebar">
            {notice && (
              <span
                className={
                  notice.startsWith("Unable") ? "field-error" : "save-success"
                }
              >
                {notice.startsWith("Unable") ? (
                  <X size={14} />
                ) : (
                  <Check size={14} />
                )}
                {notice}
              </span>
            )}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save and publish all sections"}{" "}
              <ArrowRight size={15} />
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
