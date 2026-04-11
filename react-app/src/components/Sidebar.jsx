import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Dashboard", path: "/", icon: "⬡" },
  { label: "Genres", path: "/genres", icon: "◈" },
  { label: "Countries", path: "/countries", icon: "◉" },
  { label: "Release Trend", path: "/release-trend", icon: "◌" },
  { label: "Type Distribution", path: "/type-distribution", icon: "◫" },
  { label: "Ratings", path: "/ratings", icon: "◎" },
  { label: "Prediction", path: "/prediction", icon: "◬" },
];

const CollapseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
    <path d="M15 4v16" />
    <path d="M9 10l2 2l-2 2" />
  </svg>
);

const ExpandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
    <path d="M15 4v16" />
    <path d="M10 10l-2 2l2 2" />
  </svg>
);

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const navLinksRef = useRef([]);
  const prevSidebarOpen = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useGSAP(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
    );
  }, []);

  useEffect(() => {
    if (prevSidebarOpen.current === sidebarOpen) return;
    prevSidebarOpen.current = sidebarOpen;

    if (sidebarOpen) {
      gsap.fromTo(
        navLinksRef.current,
        { x: -10, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.2,
          stagger: 0.04,
          ease: "power2.out",
          delay: 0.05,
        },
      );
    }
  }, [sidebarOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`
        ${sidebarOpen ? "w-52" : "w-[52px]"}
         transition-all duration-300 ease-in-out
        border-r border-neutral-200 dark:border-neutral-800
        flex flex-col sticky top-0 h-screen shrink-0
        bg-neutral-50 dark:bg-neutral-950
      `}
    >
      {/* Header */}
      <div
        className={`
        flex items-center h-14 px-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0
        ${sidebarOpen ? "justify-between" : "justify-center"}
      `}
      >
        {sidebarOpen && (
          <div className="inline-flex items-center justify-center gap-2 overflow-hidden">
            <span className="text-base leading-none flex items-center justify-center">
              ◈
            </span>
            <span className="text-[11px] font-black tracking-[0.15em] uppercase whitespace-nowrap text-neutral-900 dark:text-neutral-100">
              Dashboard
            </span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100
           p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
        >
          {sidebarOpen ? <CollapseIcon /> : <ExpandIcon />}
        </button>
      </div>

      {/* Nav section label */}
      <div className="px-3 pt-5 pb-2">
        {sidebarOpen ? (
          <p className="text-[9px] font-medium tracking-[0.18em] text-neutral-400 dark:text-neutral-600 uppercase">
            Navigation
          </p>
        ) : (
          <div className="w-full h-px bg-neutral-200 dark:border-neutral-800" />
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {NAV_LINKS.map((link, i) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              ref={(el) => (navLinksRef.current[i] = el)}
              to={link.path}
              title={!sidebarOpen ? link.label : undefined}
              className={`
                flex items-center gap-3 rounded-lg text-[11px] font-medium tracking-wide
                transition-all duration-150 cursor-pointer no-underline
                ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                ${
                  isActive
                    ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900"
                    : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                }
              `}
            >
              <span
                className={`
                text-base leading-none shrink-0
                ${isActive ? "opacity-100" : "opacity-50"}
              `}
              >
                {link.icon}
              </span>
              {sidebarOpen && (
                <span className="whitespace-nowrap tracking-wide">
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className={`
        px-3 py-4 border-t border-neutral-200 dark:border-neutral-800 shrink-0
        ${sidebarOpen ? "block" : "hidden"}
      `}
      >
        <p className="text-[9px] tracking-[0.12em] text-neutral-400 dark:text-neutral-600 uppercase whitespace-nowrap">
          v1.0.0 · Netflix Dataset
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
