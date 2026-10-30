import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, ArrowUpRight, Building2, CalendarDays, FileText, Eye, Pencil, Plus, Settings2, Users } from "lucide-react";
import api from "../../lib/api.js";
import { PageTitle, StatCard, StatusTag } from "../../components/Common.jsx";
import { formatDate, formatRelative } from "../../lib/format.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

export function Dashboard() {
  const [dashboard, setDashboard] = useState({
    stats: {},
    inquiries: [],
    activity: [],
  });
  const [error, setError] = useState("");
  usePageMeta("Inventory overview");
  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(({ data }) => setDashboard(data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load dashboard."),
      );
  }, []);
  const inquiries = dashboard.inquiries || [];
  const activities = dashboard.activity || [];
  return (
    <>
      <PageTitle
        eyebrow="Property overview"
        title="Aurelia Residences CMS"
        description="Your project at a glance. Changes are saved as drafts until you publish."
        actions={
          <>
            <Link to="/" className="button button-light" target="_blank">
              <Eye size={15} /> Preview site
            </Link>
            <Link to="/admin/properties" className="button button-gold">
              <Plus size={16} /> Add residence
            </Link>
          </>
        }
      />
      {error && (
        <div className="inline-error">
          {error} Ensure the API and MongoDB are running.
        </div>
      )}
      <div className="stat-grid">
        <StatCard
          icon={Users}
          label="Total buyer inquiries"
          value={dashboard.stats.totalInquiries ?? "—"}
          note={`${dashboard.stats.newInquiries ?? 0} need a response`}
          change={dashboard.stats.inquiryChange}
        />
        <StatCard
          icon={CalendarDays}
          label="Published residences"
          value={dashboard.stats.publishedProperties ?? "—"}
          note={`${dashboard.stats.draftProperties ?? 0} drafts in progress`}
          tone="brown"
        />
        <StatCard
          icon={FileText}
          label="Published CMS pages"
          value="08"
          note="2 sections in review"
          tone="olive"
        />
        <StatCard
          icon={Building2}
          label="Inventory absorption"
          value="79.6%"
          note="86 of 108 units"
          change="3.2%"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel inquiry-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">SALES PIPELINE</p>
              <h2>VIP buyer inquiries</h2>
              <p>Recent expressions of interest for Aurelia Worli Tower.</p>
            </div>
            <Link to="/admin/inquiries" className="panel-link">
              All inquiries <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>CLIENT DOSSIER</th>
                  <th>RESIDENCE</th>
                  <th>RECEIVED</th>
                  <th>STATUS</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {inquiries.slice(0, 5).map((inquiry) => (
                  <tr key={inquiry._id}>
                    <td>
                      <b>{inquiry.name}</b>
                      <small>{inquiry.email}</small>
                    </td>
                    <td>{inquiry.propertyTitle || "General enquiry"}</td>
                    <td>{formatDate(inquiry.createdAt)}</td>
                    <td>
                      <StatusTag status={inquiry.status} />
                    </td>
                    <td>
                      <Link
                        to="/admin/inquiries"
                        className="row-action"
                        aria-label="View inquiry"
                      >
                        <ArrowRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      No inquiries yet. New buyer enquiries appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-caption">
            Showing {Math.min(inquiries.length, 5)} of{" "}
            {dashboard.stats.totalInquiries ?? 0} registered inquiries
          </div>
        </section>
        <section className="panel absorption-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">INVENTORY BREAKDOWN</p>
              <h2>Unit absorption</h2>
              <p>Tower 1 & 2 by residence type.</p>
            </div>
            <Building2 size={18} className="panel-heading-icon" />
          </div>
          <div className="absorption-ring">
            <div>
              <b>79.6%</b>
              <span>ABSORBED</span>
            </div>
          </div>
          <div className="absorption-legend">
            <div>
              <i className="dot dot-gold" />
              <span>Sky penthouses</span>
              <b>6 / 8</b>
            </div>
            <div>
              <i className="dot dot-brown" />
              <span>Grand duplexes</span>
              <b>32 / 36</b>
            </div>
            <div>
              <i className="dot dot-sand" />
              <span>Signature suites</span>
              <b>48 / 64</b>
            </div>
          </div>
        </section>
      </div>
      <div className="dashboard-bottom">
        <section className="panel sections-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">LIVE SITE CONTENT</p>
              <h2>Sections manager</h2>
              <p>Keep the project story up to date.</p>
            </div>
            <Link
              to="/admin/content"
              className="icon-button"
              aria-label="Edit site content"
            >
              <Settings2 size={17} />
            </Link>
          </div>
          <div className="section-manager-row">
            <span className="drag-dots">⠿</span>
            <span>
              <b>Hero architectural banner</b>
              <small>Site identity & first impression</small>
            </span>
            <StatusTag status="published" />
            <Link to="/admin/content" className="row-action">
              <Pencil size={14} />
            </Link>
          </div>
          <div className="section-manager-row">
            <span className="drag-dots">⠿</span>
            <span>
              <b>Residences collection</b>
              <small>Published property inventory</small>
            </span>
            <StatusTag status="published" />
            <Link to="/admin/properties" className="row-action">
              <Pencil size={14} />
            </Link>
          </div>
          <div className="section-manager-row">
            <span className="drag-dots">⠿</span>
            <span>
              <b>SEO & contact details</b>
              <small>Search appearance and enquiry routing</small>
            </span>
            <StatusTag status="draft" />
            <Link to="/admin/content" className="row-action">
              <Pencil size={14} />
            </Link>
          </div>
        </section>
        <section className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">AUDIT TRAIL</p>
              <h2>Live activity</h2>
            </div>
            <Link to="/admin/activity" className="panel-link">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="activity-list">
            {activities.slice(0, 4).map((item) => (
              <div className="activity-item" key={item._id}>
                <span className="activity-marker">
                  <Activity size={13} />
                </span>
                <div>
                  <p>
                    <b>{item.actorName}</b> {item.action} <b>{item.entity}</b>
                  </p>
                  <small>{formatRelative(item.createdAt)}</small>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="activity-empty">
                Your team’s changes will appear here.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
