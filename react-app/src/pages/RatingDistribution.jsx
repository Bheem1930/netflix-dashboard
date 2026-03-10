import ChartPage from "./ChartPage";

export default function RatingDistribution() {
  return (
    <ChartPage
      index="05 / ANALYSIS"
      label="Rating Distribution"
      title="Content Ratings"
      description="Distribution of content ratings across the platform. TV-MA and TV-14 dominate — indicating a clear lean toward mature audiences. Family-friendly content exists but remains a secondary focus of the catalog."
      imageSrc="http://localhost:5000/rating-distribution"
      imageAlt="Rating Distribution"
    />
  );
}
