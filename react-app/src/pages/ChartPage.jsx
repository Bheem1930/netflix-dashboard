import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ChartPage({
  index,
  label,
  title,
  description,
  imageSrc,
  imageAlt,
}) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      headerRef.current,
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4 },
    )
      .fromTo(
        bodyRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.2",
      )
      .fromTo(
        imgRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2",
      );
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-10 py-10"
    >
      {/* Back Button */}
      <div ref={headerRef}>
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase
          text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100
          transition-colors duration-200 mb-10"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[9px] tracking-[0.2em] text-neutral-400 dark:text-neutral-600 uppercase mb-3">
              {index}
            </p>
            <h1 className="text-4xl font-black tracking-tight leading-none text-neutral-900 dark:text-neutral-50 mb-1">
              {title}
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] text-neutral-400">◈</span>
              <span className="text-[10px] tracking-widest text-neutral-400 dark:text-neutral-600 uppercase">
                {label}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-200 dark:bg-neutral-800 mb-8" />
      </div>

      {/* Description + Chart */}
      <div ref={bodyRef} className="max-w-2xl mb-10">
        <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-mono">
          {description}
        </p>
      </div>

      {/* Chart Image */}
      <div
        ref={imgRef}
        className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-neutral-900"
      >
        <div className="px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
          <span className="text-[10px] text-neutral-400">◈</span>
          <span className="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
            {label}
          </span>
        </div>
        <div className="p-6">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full max-h-168 rounded-lg block"
          />
        </div>
      </div>
    </div>
  );
}
