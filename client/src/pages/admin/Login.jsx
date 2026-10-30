import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import api from "../../lib/helper.js";
import { Button, Field } from "../../components/Common.jsx";
import { cover } from "../../lib/site.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

export function AdminLogin() {
  usePageMeta("Admin sign in");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const form = useForm({ defaultValues: { email: "", password: "" } });
  const submit = async ({ email, password }) => {
    setSubmitting(true);
    setError("");
    try {
      await api.post("/auth/login", { email, password });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Sign in failed. Check your credentials and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="login-screen">
      <div
        className="login-image"
        style={{ backgroundImage: `url("${cover}")` }}
      >
        <Link to="/" className="brand brand-inverted">
          <span className="brand-mark">A</span>
          <span>
            <b>AURELIA</b>
            <small>RESIDENCES & TOWERS</small>
          </span>
        </Link>
        <div>
          <p className="eyebrow eyebrow-light">CONFIDENTIAL SALES PORTAL</p>
          <h1>
            Every detail,
            <br />
            <em>considered.</em>
          </h1>
          <p>Secure access for the Aurelia Residences sales team.</p>
        </div>
        <span className="login-image-foot">WORLI SEA FACE · MUMBAI</span>
      </div>
      <div className="login-panel">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Back to main site
        </Link>
        <div className="login-form-box">
          <div className="admin-lock">
            <ShieldCheck size={20} />
          </div>
          <p className="eyebrow">ADMIN ACCESS</p>
          <h2>Welcome back.</h2>
          <p className="login-intro">
            Sign in to manage residences, enquiries, and your live site.
          </p>
          <form onSubmit={form.handleSubmit(submit)}>
            <Field label="Email address">
              <input
                type="email"
                autoComplete="username"
                placeholder="name@aureliaresidences.com"
                {...form.register("email", { required: true })}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...form.register("password", { required: true })}
              />
            </Field>
            {error && <div className="error-banner">{error}</div>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Verifying…" : "Sign in securely"}{" "}
              <ArrowRight size={15} />
            </Button>
          </form>
          <p className="login-security">
            <ShieldCheck size={13} /> Protected with encrypted authentication
          </p>
        </div>
        <p className="login-legal">
          AURELIA RESIDENCES · AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </main>
  );
}
