import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Filter, Mail, Phone, Search, ShieldCheck, X } from "lucide-react";
import api from "../../lib/helper.js";
import { Field, PageTitle, StatusTag } from "../../components/Common.jsx";
import { formatDate } from "../../lib/format.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

export function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  usePageMeta("Buyer inquiries");
  const load = () =>
    api
      .get("/admin/inquiries", {
        params: {
          search: query,
          status: status === "all" ? undefined : status,
        },
      })
      .then(({ data }) => {
        setInquiries(data.items || []);
        setError("");
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Unable to load inquiries."),
      );
  useEffect(() => {
    const timer = setTimeout(load, 200);
    return () => clearTimeout(timer);
  }, [query, status]);
  const updateStatus = async (item, nextStatus) => {
    try {
      await api.patch(`/admin/inquiries/${item._id}`, { status: nextStatus });
      setSelected(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update inquiry.");
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="Buyer relations"
        title="Buyer inquiries"
        description="A private, organized view of every expression of interest."
        actions={
          <span className="quiet-badge">
            <ShieldCheck size={14} /> CONFIDENTIAL
          </span>
        }
      />
      {error && <div className="inline-error">{error}</div>}
      <section className="panel inventory-panel">
        <div className="inventory-toolbar">
          <label className="admin-search">
            <Search size={16} />
            <input
              placeholder="Search name, email or residence…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="filter-select">
            <Filter size={15} />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All inquiries</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <span className="result-count">{inquiries.length} inquiries</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CLIENT DOSSIER</th>
                <th>RESIDENCE OF INTEREST</th>
                <th>MESSAGE</th>
                <th>RECEIVED</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {inquiries.map((item) => (
                <tr key={item._id}>
                  <td>
                    <b>{item.name}</b>
                    <small>{item.email}</small>
                    {item.phone && <small>{item.phone}</small>}
                  </td>
                  <td>{item.propertyTitle || "General enquiry"}</td>
                  <td className="message-cell">{item.message}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>
                    <StatusTag status={item.status} />
                  </td>
                  <td>
                    <button
                      className="row-action"
                      onClick={() => setSelected(item)}
                      title="Manage inquiry"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-table">
                    No buyer inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-caption">
          Personal information is visible to authorized sales staff only.
        </div>
      </section>
      {selected && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setSelected(null)
          }
        >
          <section className="inquiry-modal">
            <header className="modal-header">
              <div>
                <p className="eyebrow">BUYER DOSSIER</p>
                <h2>{selected.name}</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </header>
            <div className="inquiry-details">
              <a href={`mailto:${selected.email}`}>
                <Mail size={16} />
                {selected.email}
              </a>
              {selected.phone && (
                <a href={`tel:${selected.phone}`}>
                  <Phone size={16} />
                  {selected.phone}
                </a>
              )}
              <p>
                <span>RESIDENCE OF INTEREST</span>
                <b>{selected.propertyTitle || "General enquiry"}</b>
              </p>
              <p>
                <span>MESSAGE</span>
                {selected.message}
              </p>
              <p>
                <span>RECEIVED</span>
                {formatDate(selected.createdAt)}
              </p>
              <Field label="Update status">
                <select
                  value={selected.status}
                  onChange={(event) =>
                    updateStatus(selected, event.target.value)
                  }
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </Field>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
