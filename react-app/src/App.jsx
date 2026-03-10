import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Genre from "./pages/Genre";
import Country from "./pages/Country";
import ReleaseTrend from "./pages/ReleaseTrend";
import TypeDistribution from "./pages/TypeDistribution";
import RatingDistribution from "./pages/RatingDistribution";
import PredictionPage from "./pages/PredictionPage";

function App() {
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
