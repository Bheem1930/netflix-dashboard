import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { useTheme } from "../context/theme.jsx";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const CHARTS = [
  {
    title: "Genre Distribution",
    src: "http://localhost:5000/genre-chart",
    alt: "Genre Chart",
  },
  {
    title: "Country Distribution",
    src: "http://localhost:5000/country-chart",
    alt: "Country Chart",
  },
  {
    title: "Release Trend",
    src: "http://localhost:5000/release-trend",
    alt: "Release Trend",
  },
  {
    title: "Movie vs TV Shows",
    src: "http://localhost:5000/type-distribution",
    alt: "Type Distribution",
  },
];

export default function Dashboard() {
  const [ratingClasses, setRatingClasses] = useState(null);
  const { dark, setDark } = useTheme();
  const location = useLocation();

  const topbarRef = useRef(null);
  const kpiRefs = useRef([]);
  const chartRefs = useRef([]);
  const ratingRef = useRef(null);
  const mainRef = useRef(null);
  const [stats, setStats] = useState({
    total_titles: 0,
    movies: 0,
    tv_shows: 0,
  });
  const KPI_DATA = [
    { label: "Total Titles", value: stats.total_titles.toLocaleString() },
    { label: "Movies", value: stats.movies.toLocaleString() },
    { label: "TV Shows", value: stats.tv_shows.toLocaleString() },
  ];

  useEffect(() => {
    fetch("http://localhost:5000/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/model-info")
      .then((r) => r.json())
      .then((d) => setRatingClasses(d.num_classes))
      .catch(() => setRatingClasses("N/A"));
  }, []);

  gsap.registerPlugin(SplitText);
  // Mount animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const text = SplitText.create(".heading", {
      type: "chars",
    });
    tl.from(text.chars, {
      yPercent: -110,
      opacity: 0,
      duration: 0.5,
      stagger: {
        each: 0.05,
        from: "center",
      },
      ease: "power4.out",
    })
      .fromTo(
        topbarRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.4",
      )
      .fromTo(
        kpiRefs.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
        "-=0.2",
      )
      .fromTo(
        chartRefs.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.1 },
        "-=0.2",
      )
      .fromTo(
        ratingRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.2",
      );
  }, []);

  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const newTheme = !isDark;

    const switchTheme = () => {
      setDark(newTheme);
    };

    if (!document.startViewTransition) {
      switchTheme();
    } else {
      document.startViewTransition(() => {
        switchTheme();
      });
    }
  };

  const handleKpiEnter = (el) =>
    gsap.to(el, { y: -5, scale: 1.02, duration: 0.2, ease: "power2.out" });
  const handleKpiLeave = (el) =>
    gsap.to(el, { y: 0, scale: 1, duration: 0.25, ease: "power2.inOut" });

  const handleChartEnter = (el) =>
    gsap.to(el, { y: -4, duration: 0.2, ease: "power2.out" });
  const handleChartLeave = (el) =>
    gsap.to(el, { y: 0, duration: 0.25, ease: "power2.inOut" });

  return (
    <div
      ref={mainRef}
      className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 "
    >
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 min-w-0 px-8 py-8 overflow-auto">
        {/* Top Bar */}
        <div
          ref={topbarRef}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none uppercase">
                Overview
              </h1>
              <p className="text-[10px] tracking-[0.12em] text-neutral-400 dark:text-neutral-500 mt-1 uppercase">
                Netflix Platform Analytics
              </p>
            </div>
          </div>

          <button
            onClick={handleThemeToggle}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] tracking-widest uppercase border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <span>{dark ? "○" : "●"}</span>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
        <div className="heading flex items-center justify-center gap-4 mb-12 py-2 overflow-hidden">
          {["Netflix", "Analysis", "Dashboard"].map((word, i) => (
            <span
              key={i}
              className="word inline-block text-6xl text-neutral-950 dark:text-neutral-50 font-black tracking-tight"
            >
              {word}
            </span>
          ))}
        </div>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {KPI_DATA.map((kpi, i) => (
            <div
              key={kpi.label}
              ref={(el) => (kpiRefs.current[i] = el)}
              onMouseEnter={(e) => handleKpiEnter(e.currentTarget)}
              onMouseLeave={(e) => handleKpiLeave(e.currentTarget)}
              className="rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 cursor-default"
            >
              <p className="text-[9px] tracking-[0.15em] text-neutral-400 dark:text-neutral-500 uppercase mb-3">
                {kpi.label}
              </p>
              <p className="text-3xl font-black tracking-tight">{kpi.value}</p>
            </div>
          ))}

          <div
            ref={(el) => (kpiRefs.current[3] = el)}
            onMouseEnter={(e) => handleKpiEnter(e.currentTarget)}
            onMouseLeave={(e) => handleKpiLeave(e.currentTarget)}
            className="rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900  cursor-default"
          >
            <p className="text-[9px] tracking-[0.15em] text-neutral-400 dark:text-neutral-500 uppercase mb-3">
              Rating Classes
            </p>
            <p className="text-3xl font-black tracking-tight">
              {ratingClasses ?? "···"}
            </p>
          </div>
        </div>

        {/* Section Divider */}
        <div className="flex items-center gap-3 mb-5">
          <p className="text-[9px] tracking-[0.15em] text-neutral-400 dark:text-neutral-500 uppercase whitespace-nowrap">
            Visualizations
          </p>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Chart Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {CHARTS.map((chart, i) => (
            <div
              key={chart.alt}
              ref={(el) => (chartRefs.current[i] = el)}
              onMouseEnter={(e) => handleChartEnter(e.currentTarget)}
              onMouseLeave={(e) => handleChartLeave(e.currentTarget)}
              className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              <div className="px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <span className="text-[10px] text-neutral-400">◈</span>
                <span className="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
                  {chart.title}
                </span>
              </div>
              <div className="p-4">
                <img
                  src={chart.src}
                  alt={chart.alt}
                  className="w-full rounded-lg block select-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Rating Distribution */}
        <div
          ref={ratingRef}
          onMouseEnter={(e) => handleChartEnter(e.currentTarget)}
          onMouseLeave={(e) => handleChartLeave(e.currentTarget)}
          className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 "
        >
          <div className="px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
            <span className="text-[10px] text-neutral-400">◎</span>
            <span className="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
              Rating Distribution
            </span>
          </div>
          <div className="p-4">
            <img
              src={`http://localhost:5000/rating-distribution?${Date.now()}`}
              alt="Rating Distribution"
              className="w-full max-h-168 object-contain rounded-lg block"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
