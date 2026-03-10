import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const FIELDS = [
  {
    name: "listed_in",
    label: "Genre",
    placeholder: "e.g. Dramas, Comedies",
    col: 1,
  },
  {
    name: "duration",
    label: "Duration",
    placeholder: "e.g. 90 min / 2 Seasons",
    col: 1,
  },
  {
    name: "country",
    label: "Country",
    placeholder: "e.g. United States",
    col: 1,
  },
  {
    name: "release_year",
    label: "Release Year",
    placeholder: "e.g. 2021",
    type: "number",
    col: 1,
  },
];

export default function PredictionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    listed_in: "",
    duration: "",
    description: "",
    country: "",
    release_year: "",
  });
  const [results, setResults] = useState(() => {
    const stored = localStorage.getItem("predictions");
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(false);
  const [futureData, setFutureData] = useState(null);
  const [futureYears, setFutureYears] = useState(5);
  const [loadingFuture, setLoadingFuture] = useState(false);

  const headerRef = useRef(null);
  const formRef = useRef(null);
  const tableRef = useRef(null);
  const futureRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("predictions", JSON.stringify(results));
  }, [results]);

  const deletePrediction = (index) => {
    const updated = results.filter((_, i) => i !== index);
    setResults(updated);
  };

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      headerRef.current,
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4 },
    )
      .fromTo(
        formRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.2",
      )
      .fromTo(
        tableRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.2",
      );
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        duration: form.duration.includes("min")
          ? form.duration
          : `${form.duration} min`,
      };
      const res = await fetch("http://localhost:5000/predict-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResults((prev) => [
        {
          ...form,
          predicted_rating: data.predicted_rating,
          confidence: data.confidence,
          top_predictions: data.top_predictions,
        },
        ...prev,
      ]);
      setForm({
        listed_in: "",
        duration: "",
        description: "",
        country: "",
        release_year: "",
      });
    } catch {
      setResults((prev) => [{ ...form, predicted_rating: "Error" }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (results.length === 0) return;

    gsap.fromTo(
      "tbody tr:first-child",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 },
    );
  }, [results]);

  const ratingColor = (rating) => {
    const colors = {
      "TV-MA": "bg-red-600",
      R: "bg-red-500",
      "NC-17": "bg-red-700",
      "TV-14": "bg-orange-500",
      "PG-13": "bg-orange-400",
      "TV-PG": "bg-yellow-500",
      PG: "bg-yellow-400",
      "TV-G": "bg-green-500",
      G: "bg-green-400",
      "TV-Y": "bg-emerald-500",
      "TV-Y7": "bg-emerald-400",
      "TV-Y7-FV": "bg-teal-500",
      NR: "bg-neutral-500",
      UR: "bg-neutral-400",
    };
    return colors[rating] || "bg-neutral-500";
  };

  const ratingBarColor = (rating) => {
    const colors = {
      "TV-MA": "bg-red-600",
      R: "bg-red-500",
      "NC-17": "bg-red-700",
      "TV-14": "bg-orange-500",
      "PG-13": "bg-orange-400",
      "TV-PG": "bg-yellow-500",
      PG: "bg-yellow-400",
      "TV-G": "bg-green-500",
      G: "bg-green-400",
      "TV-Y": "bg-emerald-500",
      "TV-Y7": "bg-emerald-400",
      "TV-Y7-FV": "bg-teal-500",
      NR: "bg-neutral-500",
      UR: "bg-neutral-400",
    };
    return colors[rating] || "bg-neutral-400";
  };

  const inputClass = `
    w-full bg-transparent border border-neutral-200 dark:border-neutral-800
    rounded-lg px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100
    placeholder:text-neutral-400 dark:placeholder:text-neutral-600
    focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500
    transition-colors duration-150 font-mono
  `;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-10 py-10">
      {/* Header */}
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

        <div className="mb-10">
          <p className="text-[9px] tracking-[0.2em] text-neutral-400 dark:text-neutral-600 uppercase mb-3">
            06 / PREDICTION
          </p>
          <h1 className="text-4xl font-black tracking-tight leading-none text-neutral-900 dark:text-neutral-50 mb-1">
            Rating Predictor
          </h1>
        </div>

        <div className="h-px bg-neutral-200 dark:bg-neutral-800 mb-10" />
      </div>
      {/* Sample Test Prompts */}
      <div className="mt-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400">◇</span>
            <span className="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
              Sample Prompts — Try These
            </span>
          </div>
          <span className="text-[9px] tracking-widest text-neutral-400 dark:text-neutral-600 uppercase">
            Click a row to auto-fill
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                {[
                  "Target",
                  "Genre",
                  "Duration",
                  "Country",
                  "Year",
                  "Description",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[9px] tracking-[0.15em] text-neutral-400 dark:text-neutral-600 uppercase font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  target: "TV-MA",
                  listed_in: "Crime TV Shows, Thrillers",
                  duration: "1 Season",
                  country: "United States",
                  release_year: "2021",
                  description:
                    "A violent drug kingpin battles rival gangs and corrupt cops in a gritty city underworld",
                },
                {
                  target: "R",
                  listed_in: "Horror Movies, Thrillers",
                  duration: "95 min",
                  country: "United States",
                  release_year: "2020",
                  description:
                    "A group of friends go to an abandoned house where they discover something terrifying lurking in the dark",
                },
                {
                  target: "TV-14",
                  listed_in: "TV Dramas, Romantic TV Shows",
                  duration: "2 Seasons",
                  country: "United States",
                  release_year: "2021",
                  description:
                    "A high school teen navigates love, friendship and drama while hiding a secret from her family",
                },
                {
                  target: "PG-13",
                  listed_in: "Action & Adventure, Comedies",
                  duration: "110 min",
                  country: "United States",
                  release_year: "2021",
                  description:
                    "A retired spy is pulled back into action when a global threat puts his family in danger",
                },
                {
                  target: "TV-PG",
                  listed_in: "Reality TV, Docuseries",
                  duration: "1 Season",
                  country: "United Kingdom",
                  release_year: "2020",
                  description:
                    "Amateur bakers compete in weekly challenges to impress the judges and be crowned champion",
                },
                {
                  target: "PG",
                  listed_in: "Comedies, Family Movies",
                  duration: "90 min",
                  country: "United States",
                  release_year: "2021",
                  description:
                    "A lighthearted family comedy where everyone comes together to have fun and release stress",
                },
                {
                  target: "TV-Y7",
                  listed_in: "Kids' TV, Children & Family Movies",
                  duration: "1 Season",
                  country: "United States",
                  release_year: "2021",
                  description:
                    "A group of young heroes use their special powers to save their neighborhood from silly villains",
                },
                {
                  target: "TV-Y",
                  listed_in: "Kids' TV, Children & Family Movies",
                  duration: "1 Season",
                  country: "United States",
                  release_year: "2021",
                  description:
                    "Fun cartoon for kids with colorful characters singing songs and learning the alphabet",
                },
                {
                  target: "TV-G",
                  listed_in: "Children & Family Movies, Faith & Spirituality",
                  duration: "45 min",
                  country: "United States",
                  release_year: "2019",
                  description:
                    "A gentle tale about a kind old man who teaches village children important life lessons",
                },
                {
                  target: "G",
                  listed_in: "Children & Family Movies, Music & Musicals",
                  duration: "80 min",
                  country: "United States",
                  release_year: "2020",
                  description:
                    "An animated musical adventure where forest animals sing and dance to save their magical home",
                },
                {
                  target: "NR",
                  listed_in: "Documentaries, Independent Movies",
                  duration: "85 min",
                  country: "United States",
                  release_year: "2018",
                  description:
                    "An independent documentary exploring the untold stories of forgotten communities",
                },
                {
                  target: "TV-Y7-FV",
                  listed_in: "Kids' TV, Action & Adventure",
                  duration: "1 Season",
                  country: "Japan",
                  release_year: "2020",
                  description:
                    "Animated kids show with fantasy battles where young warriors fight monsters to protect their world",
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  onClick={() =>
                    setForm({
                      listed_in: row.listed_in,
                      duration: row.duration,
                      country: row.country,
                      release_year: row.release_year,
                      description: row.description,
                    })
                  }
                  className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-0
                    cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors duration-100"
                >
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black tracking-wide text-neutral-50 dark:text-neutral-900 ${ratingColor(row.target)}`}
                    >
                      {row.target}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-300 max-w-40 truncate">
                    {row.listed_in}
                  </td>
                  <td className="px-4 py-2.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                    {row.duration}
                  </td>
                  <td className="px-4 py-2.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                    {row.country}
                  </td>
                  <td className="px-4 py-2.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                    {row.release_year}
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-neutral-500 dark:text-neutral-400 max-w-60 truncate">
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      <div
        ref={formRef}
        className="rounded-xl border mt-5 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 mb-8"
      >
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
          <span className="text-[10px] text-neutral-400">◬</span>
          <span className="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
            Input Parameters
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELDS.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-[9px] tracking-[0.15em] text-neutral-400 dark:text-neutral-500 uppercase font-medium">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          {/* Description full width */}
          <div className="space-y-1.5">
            <label className="text-[9px] tracking-[0.15em] text-neutral-400 dark:text-neutral-500 uppercase font-medium">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Brief description of the title..."
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-[11px] tracking-widest uppercase font-medium
            bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900
            hover:bg-neutral-700 dark:hover:bg-neutral-200
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-200"
          >
            {loading ? "Predicting···" : "Predict Rating"}
          </button>
        </form>
      </div>

      {/* Results Table */}
      <div
        ref={tableRef}
        className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400">◎</span>
            <span className="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
              Prediction Results
            </span>
          </div>
          {results.length > 0 && (
            <span className="text-[9px] tracking-widest text-neutral-400 dark:text-neutral-600 uppercase">
              {results.length} {results.length === 1 ? "entry" : "entries"}
            </span>
          )}
        </div>

        {results.length === 0 ? (
          <div className="px-6 py-16 flex flex-col items-center justify-center gap-3">
            <span className="text-3xl opacity-20">◬</span>
            <p className="text-[11px] tracking-widest text-neutral-400 dark:text-neutral-600 uppercase">
              No predictions yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  {[
                    "Genre",
                    "Duration",
                    "Country",
                    "Year",
                    "Predicted Rating",
                    "Confidence",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[9px] tracking-[0.15em] text-neutral-400 dark:text-neutral-600 uppercase font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-0
                    hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors duration-100"
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                      {row.listed_in}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                      {row.duration}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                      {row.country}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                      {row.release_year}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide
                         text-neutral-50 dark:text-neutral-900  ${ratingColor(row.predicted_rating)}`}
                      >
                        {row.predicted_rating}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 min-w-[200px]">
                      {row.top_predictions ? (
                        <div className="space-y-1">
                          {row.top_predictions.map((pred) => (
                            <div
                              key={pred.rating}
                              className="flex items-center gap-2"
                            >
                              <span className="text-[9px] font-mono text-neutral-500 w-14">
                                {pred.rating}
                              </span>
                              <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${ratingBarColor(pred.rating)}`}
                                  style={{
                                    width: `${pred.confidence}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[9px] font-mono text-neutral-400 w-10 text-right">
                                {pred.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[9px] text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => deletePrediction(i)}
                        className="px-2 py-1 text-[10px] rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
