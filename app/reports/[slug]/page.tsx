'use client';
import ConnectButton from '@/components/connect-button';
import { useParams } from 'next/navigation';

const getReportData = async (slug?: string | string[]) => {
	const res = await fetch(`http://localhost:3000/api/reports/${slug}`);
	const data = await res.json();
	return data;
}

export default function ReportPage() {
	const {slug} = useParams();
	const data = getReportData(slug);

  return (
    <div>
			<ConnectButton />
      <h1>Report Slug: {slug}</h1>
    </div>
  );
}
