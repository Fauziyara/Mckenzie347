import PairDetailClient from "./pair-detail-client";

export default function Page({ params }: { params: Promise<{ address: string }> }) {
  return <PairDetailClient params={params} />;
}
