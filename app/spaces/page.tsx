"use client";
import React, {useState, useEffect} from 'react';
import { ResponsivePie } from '@nivo/pie';
import { NextResponse } from 'next/server';

export async function getUseCasesBySpace() {
	try {
		const res = await fetch('http://localhost:3000/api/spaces/all', {
			method: 'GET'});
				const data = await res.json();
					console.log(data);
				return data;
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false, error: 'Failed to fetch use cases' }, { status: 500 });
	}
}

const LABELS = {
	'accepted': 'Accepted',
	'included': 'Included in PRD',
	'inReview': 'In Review',
	'rejected': 'Rejected',
	'unprocessed': 'Unprocessed'
}

type ByCategory = Record<string, number>;
type SpaceData = {
space: string;
byCategory: ByCategory;
};
type UseCasesBySpaceResponse = {
success: boolean;
data: {
bySpace: SpaceData[];
} | null;
};

export default function Page() {
	const [data, setData] = useState<UseCasesBySpaceResponse>({ success: false, data: null });
	useEffect(() => {
		const fetchData = async () => {
		const data = await getUseCasesBySpace();
		setData(data);
	};
	fetchData()
	}, []);

	if (!data.data) {
	return <div>Loading...</div>;
		}
		else if (!data.success) {
			return <div>Error fetching use cases</div>;
	}

	return (
		<div>
			<h1>Use Cases by Space</h1>
				<div className="grid grid-cols-3 gap-4">
				{data?.data?.bySpace?.map((space, index) => (
					<div key={index}>
						<h2>{space.space}</h2>
							<div className="h-96">
							{ <ResponsivePie
							data={Object.keys(space.byCategory).map((category) => ({
								id: LABELS[category as keyof typeof LABELS],
								label: LABELS[category as keyof typeof LABELS],
								value: space.byCategory[category]
								}))}
							margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
							innerRadius={0.5}
							padAngle={0.6}
							cornerRadius={2}
							activeOuterRadiusOffset={8}
							arcLinkLabelsSkipAngle={10}
							arcLinkLabelsTextColor="#333333"
							arcLinkLabelsThickness={2}
							arcLinkLabelsColor={{ from: 'color' }}
							arcLabelsSkipAngle={10}
							arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
							legends={[
								{
									anchor: 'bottom',
									direction: 'row',
									translateY: 56,
									itemWidth: 100,
									itemHeight: 18,
									symbolShape: 'circle'
								}
							]}
				/>}</div>
					</div>
				))}
					</div>
	</div>
	);
}
