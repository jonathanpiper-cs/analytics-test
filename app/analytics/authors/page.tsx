"use client";
import React, {useState, useEffect} from 'react';
import { hexToHSL, LABELS, NivoTheme } from '@/lib/utils';
import { ResponsiveBar } from '@nivo/bar';
import { NextResponse } from 'next/server';

export async function getUseCasesByAuthor() {
	try {
		const res = await fetch('http://localhost:3000/api/authors/all', {method: 'GET'});
		const data = await res.json();
		return data;
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false, error: 'Failed to fetch use cases' }, { status: 500 });
	}
}

type ByCategory = Record<string, number>;
type AuthorData = {
	author: string;
		cases: UseCase[];
	byCategory: ByCategory;
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
type UseCasesByAuthorResponse = {
	useCases: UseCase[];
	success: boolean;
	data: {
		analysis: AuthorData[];
	} | null;
};

export default function Page() {
	const [data, setData] = useState<UseCasesByAuthorResponse>({ success: false, data: null, useCases: [] });
	useEffect(() => {
		const fetchData = async () => {
		const data = await getUseCasesByAuthor();
		setData(data);
	};
	fetchData()
	}, []);

	useEffect(() => {
		console.log(
			data?.data?.analysis.map((author) => ({
				"author": author.author,
				...Object.fromEntries(
					Object.keys(author.byCategory).flatMap((category) => [
						[
							category,
							author.byCategory[category]
						],
						[
							`${category}Color`,
							`${hexToHSL(LABELS[category as keyof typeof LABELS]?.color || '#000000')}`
						]
					])
				)
			}))
		);
	}, [data]);

	if (!data.data) {
		return <div>Loading...</div>;
	} else if (!data.success) {
		return <div>Error fetching use cases</div>;
	}

	return (
		<div className="flex flex-col place-self-center w-[90%] m-8">
			<h1 className="text-4xl font-bold place-self-start">Use Cases by Author</h1>
			<div className="w-full min-h-[400px] max-h-[1000px] h-dvh -mt-8">
				<ResponsiveBar
					// data={dummyData}
						theme={NivoTheme}
					data={data.data.analysis.map((author) => ({
					"Author Name": author.author,
					...Object.fromEntries(
					Object.keys(author.byCategory).flatMap((category) => [
					[
					category,
					author.byCategory[category]
					],
					[
					`${category}Color`,
					`${hexToHSL(LABELS[category as keyof typeof LABELS]?.color || '#000000')}`
					]
					])
					)}))}
					indexBy="Author Name"
					keys={[
					'accepted',
					'included',
					'inReview',
					'rejected',
                    'unprocessed'
					]}
						// indexBy="country"
						// keys={['hot dogs']}
					labelSkipHeight={16}
					labelSkipWidth={16}
					labelTextColor="inherit:darker(1.4)"
					margin={{
						bottom: 60,
						left: 160,
						right: 110,
						top: 60
					}}
					onClick={() => {}}
					onMouseEnter={() => {}}
					onMouseLeave={() => {}}
					padding={0.2}
						colors={({
				id,
				data,
		}: { id: string | number; data: Record<string, string | number> }) => String(data[`${id}Color`])}
			layout="horizontal"
            animate={false}

			/>
			</div>
				<div className="place-self-start ">
					{data?.data.analysis?.map((author, authorIdx) => (
						<div key={authorIdx} className="mb-8">
							<h1 className="text-xl font-bold mb-2">{author.author}</h1>
							{author.cases.map((useCase, caseIdx) => (
								<div key={`${authorIdx}-${caseIdx}`}>
									<h2>{useCase.title}</h2>
								</div>
							))}
						</div>
					))}
				</div>
		</div>
	);
}
