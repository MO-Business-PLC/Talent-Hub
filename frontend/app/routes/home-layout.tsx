import { Outlet } from "react-router";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-light-gray">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
