import { useEffect, useState } from "react";
import { Activity, ShieldCheck } from "lucide-react";
import api from "../../lib/api.js";
import { PageTitle } from "../../components/Common.jsx";
import { formatDate, formatRelative } from "../../lib/format.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

export function ActivityPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  usePageMeta("Activity log");
  useEffect(() => {
    api
      .get("/admin/activity")
      .then(({ data }) => setItems(data.items || []))
      .catch((err) =>
        setError(
          err.response?.data?.message || "Unable to load the activity log.",
        ),
      );
  }, []);
  return (
    <>
      <PageTitle
        eyebrow="Audit trail"
        title="Activity log"
        description="A chronological record of changes made by your team."
        actions={
          <span className="quiet-badge">
            <ShieldCheck size={14} /> ADMIN AUDIT
          </span>
        }
      />
      {error && <div className="inline-error">{error}</div>}
      <section className="panel activity-full">
        {items.map((item) => (
          <div className="activity-item" key={item._id}>
            <span className="activity-marker">
              <Activity size={13} />
            </span>
            <div>
              <p>
                <b>{item.actorName}</b> {item.action} <b>{item.entity}</b>
                {item.details && <span> · {item.details}</span>}
              </p>
              <small>
                {formatDate(item.createdAt)} · {formatRelative(item.createdAt)}
              </small>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="empty-table">No activity has been recorded yet.</div>
        )}
      </section>
    </>
  );
}
