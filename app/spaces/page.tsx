"use client";
import React, {useState, useEffect} from 'react';
import { ResponsivePie } from '@nivo/pie';
import { NextResponse } from 'next/server';
import { LABELS, NivoTheme } from '@/lib/utils';

export async function getUseCasesBySpace() {
	try {
		const res = await fetch('http://localhost:3000/api/spaces/all', {method: 'GET'});
		const data = await res.json();
			console.log(data)
		return data;
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false, error: 'Failed to fetch use cases' }, { status: 500 });
	}
}

type ByCategory = Record<string, number>;
type SpaceData = {
	space: string;
	byCategory: ByCategory;
		cases: UseCase[];
};
type UseCase = {
	title: string;
	space: string;
	checkboxes: string[];
	number_in_parent: number;
	author_name: string;
	customer_name: string;
	date: string;
	_links: {
		edituiv2: string;
	};
}
type UseCasesBySpaceResponse = {
	useCases: UseCase[];
	success: boolean;
	data: {
		analysis: SpaceData[];
	} | null;
};

export default function Page() {
	const [data, setData] = useState<UseCasesBySpaceResponse>({ success: false, data: null, useCases: [] });
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
		<div className="flex flex-col place-self-center w-[90%] m-8">
			<h1 className="text-4xl font-bold">Use Cases by Space</h1>
				<div className="grid grid-cols-3 gap-4">
				{data?.data?.analysis?.map((space, index) => (
					<div key={index}>
						<h2>{space.space}</h2>
							<div className="h-96">
							{ <ResponsivePie
								data={Object.keys(space.byCategory).map((category) => ({
									id: LABELS[category as keyof typeof LABELS].legend,
									label: LABELS[category as keyof typeof LABELS].legend,
									value: space.byCategory[category],
										color: LABELS[category as keyof typeof LABELS].color
									}))}
                                theme={NivoTheme}
								margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
									colors={{ datum: 'data.color' }}
								innerRadius={0.5}
								padAngle={0.6}
								cornerRadius={2}
								activeOuterRadiusOffset={8}
								arcLinkLabelsSkipAngle={10}
								arcLinkLabelsTextColor="#dddddd"
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
<div className="place-self-start ">
	{data?.data.analysis?.map((space, spaceIdx) => (
		<div key={spaceIdx} className="mb-8">
			<h1 className="text-xl font-bold mb-2">{space.space}</h1>
			{space.cases.map((useCase, caseIdx) => (
				<div key={`${spaceIdx}-${caseIdx}`}>
					<h2>{useCase.title}</h2>
				</div>
			))}
		</div>
	))}
	</div>
	</div>
	);
}
