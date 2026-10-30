import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLogin } from "./pages/admin/Login.jsx";
import { AdminShell } from "./pages/admin/Layout.jsx";
import { ContactPage } from "./pages/public/Contact.jsx";
import { PropertyDetail } from "./pages/public/PropertyDetail.jsx";
import { PublicHome } from "./pages/public/Home.jsx";
import { AdminGate, NotFound } from "./components/Common.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/residences/:slug" element={<PropertyDetail />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin/sign-in" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <AdminGate>
            {(user) => <AdminShell user={user} />}
          </AdminGate>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
