import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Genre from "./pages/Genre";
import Country from "./pages/Country";
import ReleaseTrend from "./pages/ReleaseTrend";
import TypeDistribution from "./pages/TypeDistribution";
import RatingDistribution from "./pages/RatingDistribution";
import PredictionPage from "./pages/PredictionPage";
import { useEffect } from "react";
import { useTheme } from "./context/theme";

function App() {
  const { setDark } = useTheme();
  const toggleTheme = () => {
    const switchTheme = () => setDark((prev) => !prev);

    if (!document.startViewTransition) {
      switchTheme();
    } else {
      document.startViewTransition(() => {
        switchTheme();
      });
    }
  };

  useEffect(() => {
    const handleKeyClick = (e) => {
      if (e.key === "d" || e.key === "D") {
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyClick);
    return () => {
      window.removeEventListener("keydown", handleKeyClick);
    };
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/genres" element={<Genre />} />
        <Route path="/countries" element={<Country />} />
        <Route path="/release-trend" element={<ReleaseTrend />} />
        <Route path="/type-distribution" element={<TypeDistribution />} />
        <Route path="/ratings" element={<RatingDistribution />} />
        <Route path="/prediction" element={<PredictionPage />} />
      </Routes>
    </>
  );
}

export default App;
