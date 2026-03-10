import ChartPage from "./ChartPage";

export default function Country() {
  return (
    <ChartPage
      index="02 / ANALYSIS"
      label="Country Distribution"
      title="Global Content Map"
      description="Countries producing the most content available on the platform. The United States leads by a significant margin, followed by India and the United Kingdom — reflecting the platform's global acquisition strategy."
      imageSrc="http://localhost:5000/country-chart"
      imageAlt="Country Distribution"
    />
  );
}
