import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import '../styles/style.css';

const Layout = () => {
  return (
    <div className="layout-root">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
