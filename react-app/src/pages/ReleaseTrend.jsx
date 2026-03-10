import ChartPage from "./ChartPage";

export default function ReleaseTrend() {
  return (
    <ChartPage
      index="03 / ANALYSIS"
      label="Release Trend"
      title="Release Over Time"
      description="How the number of released titles has shifted across years. The growth curve reflects the streaming era's content explosion — with sharp peaks indicating aggressive acquisition periods and gradual normalization after."
      imageSrc="http://localhost:5000/release-trend"
      imageAlt="Release Trend"
    />
  );
}
