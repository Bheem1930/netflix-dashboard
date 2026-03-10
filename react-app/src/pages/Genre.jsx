import ChartPage from "./ChartPage";

export default function Genre() {
  return (
    <ChartPage
      index="01 / ANALYSIS"
      label="Genre Distribution"
      title="Genre Breakdown"
      description="Distribution of content by genre across the streaming platform. Categories like Drama, Comedy, and Documentary dominate the catalog — revealing viewer preferences and content investment trends over time."
      imageSrc="http://localhost:5000/genre-chart"
      imageAlt="Genre Distribution"
    />
  );
}
