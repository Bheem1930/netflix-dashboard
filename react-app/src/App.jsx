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
  const { dark, setDark } = useTheme();
  useEffect(() => {
    const handleKeyClick = (e) => {
      if (e.key === "d" || e.key.d === "D") {
        setDark(!dark);
      }
    };
    window.addEventListener("keydown", handleKeyClick);
    return () => {
      window.removeEventListener("keydown", handleKeyClick);
    };
  }, [dark, setDark]);
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
