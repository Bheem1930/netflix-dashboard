import ChartPage from "./ChartPage";

export default function TypeDistribution() {
  return (
    <ChartPage
      index="04 / ANALYSIS"
      label="Type Distribution"
      title="Movies vs TV Shows"
      description="Breakdown of content types available on the platform. Movies dominate the catalog while TV Shows represent a smaller but rapidly growing share — signaling a strategic shift toward episodic, long-form engagement."
      imageSrc="http://localhost:5000/type-distribution"
      imageAlt="Movie vs TV Show Distribution"
    />
  );
}
