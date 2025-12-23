import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="header">
      <div className="container header-inner">
        <button
          className="menu-btn"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="menu-icon" aria-hidden="true" />
        </button>

        <nav
          className={`nav ${open ? "nav-open" : ""}`}
          aria-label="Primary"
        >
          <NavLink to="/" className="nav-link" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/projects" className="nav-link" onClick={() => setOpen(false)}>
            Projects
          </NavLink>
          <NavLink to="/contact" className="nav-link" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
