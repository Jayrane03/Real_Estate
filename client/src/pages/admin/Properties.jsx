import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, ListPlus, Pencil, Plus, Search, ShieldCheck, SlidersHorizontal, Sparkles, Trash2, Upload, X } from "lucide-react";
import api from "../../lib/helper.js";
import { Button, Field, PageTitle, StatusTag } from "../../components/Common.jsx";
import { cover } from "../../lib/site.js";
import { formatDate, formatPrice, lines } from "../../lib/format.js";
import { propertySchema } from "../../lib/validation.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

export function PropertyEditor({ property, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          ...property,
          galleryText: property.gallery?.join("\n") || "",
          amenitiesText:
            property.amenities?.map((item) => item.name).join("\n") || "",
          floorPlans: property.floorPlans || [],
          seoTitle: property.seo?.title || "",
          seoDescription: property.seo?.description || "",
        }
      : {
          title: "",
          price: "",
          address: "",
          neighborhood: "Worli Sea Face",
          beds: 3,
          baths: 3,
          area: "",
          type: "Apartment",
          status: "draft",
          excerpt: "",
          description: "",
          coverImage: "",
          galleryText: "",
          amenitiesText: "",
          floorPlans: [],
          seoTitle: "",
          seoDescription: "",
        },
  });
  const floorPlanFields = useFieldArray({
    control: form.control,
    name: "floorPlans",
  });
  const submit = async (values) => {
    setSaving(true);
    setError("");
    const body = {
      ...values,
      gallery: lines(values.galleryText),
      amenities: lines(values.amenitiesText).map((name) => ({ name })),
      seo: { title: values.seoTitle, description: values.seoDescription },
    };
    delete body.galleryText;
    delete body.amenitiesText;
    delete body.seoTitle;
    delete body.seoDescription;
    try {
      if (property?._id)
        await api.put(`/admin/properties/${property._id}`, body);
      else await api.post("/admin/properties", body);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save this residence.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="editor-modal">
        <header className="modal-header">
          <div>
            <p className="eyebrow">RESIDENCE DETAILS</p>
            <h2>{property ? "Edit residence" : "Add a residence"}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </header>
        <form onSubmit={form.handleSubmit(submit)} className="editor-form">
          <div className="editor-scroll">
            <div className="form-grid">
              <Field
                label="Residence name"
                error={form.formState.errors.title?.message}
                className="span-2"
              >
                <input
                  {...form.register("title")}
                  placeholder="e.g. The Aurelia Sky Residence"
                />
              </Field>
              <Field
                label="Price (INR)"
                error={form.formState.errors.price?.message}
              >
                <input
                  type="number"
                  min="1"
                  {...form.register("price")}
                  placeholder="185000000"
                />
              </Field>
              <Field label="Residence type">
                <select {...form.register("type")}>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Penthouse</option>
                </select>
              </Field>
              <Field
                label="Project address"
                error={form.formState.errors.address?.message}
                className="span-2"
              >
                <input
                  {...form.register("address")}
                  placeholder="Worli Sea Face Boulevard, Mumbai"
                />
              </Field>
              <Field label="Neighborhood">
                <input {...form.register("neighborhood")} />
              </Field>
              <Field label="Publishing status">
                <select {...form.register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </Field>
              <Field label="Bedrooms">
                <input type="number" min="0" {...form.register("beds")} />
              </Field>
              <Field label="Bathrooms">
                <input type="number" min="0" {...form.register("baths")} />
              </Field>
              <Field label="Area (sq. ft.)">
                <input type="number" min="0" {...form.register("area")} />
              </Field>
              <Field
                label="Cover image URL"
                error={form.formState.errors.coverImage?.message}
                className="span-2"
              >
                <input
                  {...form.register("coverImage")}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Short description" className="span-2">
                <textarea
                  rows="2"
                  {...form.register("excerpt")}
                  placeholder="A concise introduction for the property card."
                />
              </Field>
              <Field label="Full description" className="span-2">
                <textarea
                  rows="4"
                  {...form.register("description")}
                  placeholder="Tell the residence story…"
                />
              </Field>
              <Field
                label="Gallery image URLs · one per line"
                className="span-2"
              >
                <textarea
                  rows="3"
                  {...form.register("galleryText")}
                  placeholder="https://image-one.jpg"
                />
              </Field>
              <Field label="Amenities · one per line" className="span-2">
                <textarea
                  rows="3"
                  {...form.register("amenitiesText")}
                  placeholder={
                    "Sea-facing infinity pool\nPrivate residents lounge"
                  }
                />
              </Field>
              <div className="form-section-label span-2">
                <ListPlus size={15} /> FLOOR PLANS
              </div>
              <div className="span-2 floor-plan-editor-list">
                {floorPlanFields.fields.map((plan, index) => (
                  <div className="form-grid floor-plan-editor-row" key={plan.id}>
                    <Field
                      label={`Plan ${index + 1} name`}
                      error={form.formState.errors.floorPlans?.[index]?.name?.message}
                      className="span-2"
                    >
                      <input {...form.register(`floorPlans.${index}.name`)} placeholder="e.g. Three-bedroom residence" />
                    </Field>
                    <Field label="Bedrooms">
                      <input type="number" min="0" {...form.register(`floorPlans.${index}.beds`)} />
                    </Field>
                    <Field label="Bathrooms">
                      <input type="number" min="0" {...form.register(`floorPlans.${index}.baths`)} />
                    </Field>
                    <Field label="Area (sq. ft.)">
                      <input type="number" min="0" {...form.register(`floorPlans.${index}.area`)} />
                    </Field>
                    <Field label="Floor plan image URL" className="span-2">
                      <input {...form.register(`floorPlans.${index}.image`)} placeholder="https://…" />
                    </Field>
                    <button
                      className="row-action danger-action"
                      type="button"
                      onClick={() => floorPlanFields.remove(index)}
                      aria-label={`Remove floor plan ${index + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button
                  className="button button-light"
                  type="button"
                  onClick={() => floorPlanFields.append({ name: "", beds: 0, baths: 0, area: 0, image: "" })}
                  disabled={floorPlanFields.fields.length >= 20}
                >
                  <ListPlus size={15} /> Add floor plan
                </button>
              </div>
              <div className="form-section-label span-2">
                <Sparkles size={15} /> SEARCH ENGINE OPTIMIZATION
              </div>
              <Field label="SEO title" className="span-2">
                <input
                  {...form.register("seoTitle")}
                  placeholder="Search result title"
                />
              </Field>
              <Field label="SEO description" className="span-2">
                <textarea
                  rows="2"
                  {...form.register("seoDescription")}
                  placeholder="A concise search description for this residence."
                />
              </Field>
            </div>
            {error && <div className="error-banner">{error}</div>}
          </div>
          <footer className="modal-footer">
            <span>
              <ShieldCheck size={14} />{" "}
              {form.watch("status") === "published"
                ? "Changes will be visible on the public site."
                : "Drafts are only visible to your team."}
            </span>
            <button
              type="button"
              className="button button-light"
              onClick={onClose}
            >
              Cancel
            </button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save residence"} <Check size={15} />
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [create, setCreate] = useState(false);
  const [error, setError] = useState("");
  usePageMeta("Residences");
  const load = () =>
    api
      .get("/admin/properties", {
        params: {
          search: query,
          status: status === "all" ? undefined : status,
        },
      })
      .then(({ data }) => {
        setProperties(data.items || []);
        setError("");
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Unable to load residences."),
      );
  useEffect(() => {
    const timer = setTimeout(load, 220);
    return () => clearTimeout(timer);
  }, [query, status]);
  const remove = async (item) => {
    if (!window.confirm(`Permanently delete “${item.title}”?`)) return;
    try {
      await api.delete(`/admin/properties/${item._id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete residence.");
    }
  };
  const publishAll = async () => {
    const drafts = properties.filter((item) => item.status === "draft");
    await Promise.all(
      drafts.map((item) => api.patch(`/admin/properties/${item._id}/publish`)),
    );
    load();
  };
  return (
    <>
      <PageTitle
        eyebrow="Property inventory"
        title="Residences"
        description="Manage the residences presented on your public project site."
        actions={
          <>
            <button className="button button-light" onClick={publishAll}>
              <Upload size={15} /> Publish drafts
            </button>
            <Button onClick={() => setCreate(true)}>
              <Plus size={16} /> Add residence
            </Button>
          </>
        }
      />
      {error && <div className="inline-error">{error}</div>}
      <section className="panel inventory-panel">
        <div className="inventory-toolbar">
          <label className="admin-search">
            <Search size={16} />
            <input
              placeholder="Search residences…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="filter-select">
            <SlidersHorizontal size={15} />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <span className="result-count">
            {properties.length}{" "}
            {properties.length === 1 ? "residence" : "residences"}
          </span>
        </div>
        <div className="table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>RESIDENCE</th>
                <th>LOCATION</th>
                <th>PRICE</th>
                <th>CONFIGURATION</th>
                <th>STATUS</th>
                <th>UPDATED</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {properties.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="inventory-title">
                      <img src={item.coverImage || cover} alt="" />
                      <span>
                        <b>{item.title}</b>
                        <small>{item.type}</small>
                      </span>
                    </div>
                  </td>
                  <td>{item.neighborhood || item.city}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    {item.beds} bed · {item.baths} bath
                    <br />
                    <small>
                      {Number(item.area).toLocaleString("en-IN")} sq. ft.
                    </small>
                  </td>
                  <td>
                    <StatusTag status={item.status} />
                  </td>
                  <td>{formatDate(item.updatedAt)}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="row-action"
                        onClick={() => setEditing(item)}
                        aria-label={`Edit ${item.title}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="row-action danger-action"
                        onClick={() => remove(item)}
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    {error
                      ? "Inventory unavailable."
                      : "No residences match. Add your first property to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {(editing || create) && (
        <PropertyEditor
          property={editing}
          onClose={() => {
            setEditing(null);
            setCreate(false);
          }}
          onSaved={() => {
            setEditing(null);
            setCreate(false);
            load();
          }}
        />
      )}
    </>
  );
}
