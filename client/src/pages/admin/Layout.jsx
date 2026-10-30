import { useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Activity, Building2, Clock3, FileText, LayoutDashboard, LogOut, Menu, MessageSquareText, SquareArrowOutUpRight } from "lucide-react";
import api from "../../lib/helper.js";
import { Dashboard } from "./Dashboard.jsx";
import { PropertiesPage } from "./Properties.jsx";
import { InquiriesPage } from "./Inquiries.jsx";
import { ContentPage } from "./Content.jsx";
import { ActivityPage } from "./Activity.jsx";

export function AdminShell({ user }) {
  const [mobileNav, setMobileNav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    navigate("/admin/sign-in");
  };
  const nav = [
    {
      to: "/admin",
      label: "Inventory overview",
      icon: LayoutDashboard,
      end: true,
    },
    { to: "/admin/properties", label: "Residences", icon: Building2 },
    {
      to: "/admin/inquiries",
      label: "Buyer inquiries",
      icon: MessageSquareText,
    },
    { to: "/admin/content", label: "Site content", icon: FileText },
    { to: "/admin/activity", label: "Activity log", icon: Activity },
  ];
  return (
    <div className="admin-app">
      <aside className={`admin-sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <Link to="/admin" className="admin-brand">
          <span className="brand-mark">A</span>
          <span>
            <b>AURELIA</b>
            <small>ADMIN SUITE</small>
          </span>
        </Link>
        <div className="project-ref">
          <span>PROJECT REFERENCE</span>
          <b>PRM/KA/RERA/1251/310</b>
        </div>
        <span className="sidebar-label">WORKSPACE</span>
        <nav>
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileNav(false)}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={17} />
              {label}
              {label === "Buyer inquiries" && <span className="nav-pip" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a href="/#residences">
            <SquareArrowOutUpRight size={16} /> Preview main site
          </a>
          <div className="sidebar-user">
            <span className="avatar">{user.name?.slice(0, 1) || "A"}</span>
            <div>
              <b>{user.name || "Admin"}</b>
              <small>
                {user.role === "admin" ? "Administrator" : "Editor access"}
              </small>
            </div>
            <button
              className="icon-button"
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="icon-button admin-menu"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle menu"
          >
            <Menu size={19} />
          </button>
          <div className="topbar-context">
            <span>CONFIDENTIAL SALES PORTAL</span>
            <b>
              {nav.find((item) => item.to === location.pathname)?.label ||
                "Aurelia CMS"}
            </b>
          </div>
          <div className="topbar-right">
            <span className="live-dot">
              <i /> LIVE SITE
            </span>
            <span className="topbar-date">
              <Clock3 size={14} />{" "}
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="avatar top-avatar">
              {user.name?.slice(0, 1) || "A"}
            </span>
          </div>
        </header>
        <main className="admin-content">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
