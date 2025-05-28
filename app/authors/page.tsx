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

		// const dummyData =[
		// {
		// burgers: 194,
		// burgersColor: 'hsl(130, 70%, 50%)',
		// country: 'AD',
		// donut: 35,
		// donutColor: 'hsl(236, 70%, 50%)',
		// fries: 5,
		// friesColor: 'hsl(120, 70%, 50%)',
		// 'hot dogs': 4,
		// 'hot dogsColor': 'hsl(20, 70%, 50%)',
		// kebab: 162,
		// kebabColor: 'hsl(217, 70%, 50%)',
		// sandwich: 34,
		// sandwichColor: 'hsl(9, 70%, 50%)'
		// },
		// {
		// burgers: 88,
		// burgersColor: 'hsl(172, 70%, 50%)',
		// country: 'AE',
		// donut: 107,
		// donutColor: 'hsl(105, 70%, 50%)',
		// fries: 99,
		// friesColor: 'hsl(189, 70%, 50%)',
		// 'hot dogs': 59,
		// 'hot dogsColor': 'hsl(140, 70%, 50%)',
		// kebab: 140,
		// kebabColor: 'hsl(27, 70%, 50%)',
		// sandwich: 50,
		// sandwichColor: 'hsl(51, 70%, 50%)'
		// },
		// {
		// burgers: 168,
		// burgersColor: 'hsl(239, 70%, 50%)',
		// country: 'AF',
		// donut: 167,
		// donutColor: 'hsl(32, 70%, 50%)',
		// fries: 2,
		// friesColor: 'hsl(338, 70%, 50%)',
		// 'hot dogs': 198,
		// 'hot dogsColor': 'hsl(317, 70%, 50%)',
		// kebab: 97,
		// kebabColor: 'hsl(54, 70%, 50%)',
		// sandwich: 74,
		// sandwichColor: 'hsl(319, 70%, 50%)'
		// },
		// {
		// burgers: 60,
		// burgersColor: 'hsl(84, 70%, 50%)',
		// country: 'AG',
		// donut: 149,
		// donutColor: 'hsl(0, 70%, 50%)',
		// fries: 84,
		// friesColor: 'hsl(265, 70%, 50%)',
		// 'hot dogs': 106,
		// 'hot dogsColor': 'hsl(331, 70%, 50%)',
		// kebab: 103,
		// kebabColor: 'hsl(27, 70%, 50%)',
		// sandwich: 43,
		// sandwichColor: 'hsl(49, 70%, 50%)'
		// },
		// {
		// burgers: 137,
		// burgersColor: 'hsl(3, 70%, 50%)',
		// country: 'AI',
		// donut: 177,
		// donutColor: 'hsl(341, 70%, 50%)',
		// fries: 5,
		// friesColor: 'hsl(85, 70%, 50%)',
		// 'hot dogs': 135,
		// 'hot dogsColor': 'hsl(274, 70%, 50%)',
		// kebab: 107,
		// kebabColor: 'hsl(197, 70%, 50%)',
		// sandwich: 28,
		// sandwichColor: 'hsl(196, 70%, 50%)'
		// },
		// {
		// burgers: 47,
		// burgersColor: 'hsl(124, 70%, 50%)',
		// country: 'AL',
		// donut: 76,
		// donutColor: 'hsl(188, 70%, 50%)',
		// fries: 200,
		// friesColor: 'hsl(142, 70%, 50%)',
		// 'hot dogs': 140,
		// 'hot dogsColor': 'hsl(354, 70%, 50%)',
		// kebab: 90,
		// kebabColor: 'hsl(330, 70%, 50%)',
		// sandwich: 10,
		// sandwichColor: 'hsl(222, 70%, 50%)'
		// },
		// {
		// burgers: 103,
		// burgersColor: 'hsl(55, 70%, 50%)',
		// country: 'AM',
		// donut: 80,
		// donutColor: 'hsl(177, 70%, 50%)',
		// fries: 32,
		// friesColor: 'hsl(130, 70%, 50%)',
		// 'hot dogs': 186,
		// 'hot dogsColor': 'hsl(247, 70.20%, 50.00%)',
		// kebab: 186,
		// kebabColor: 'hsl(46, 70%, 50%)',
		// sandwich: 4,
		// sandwichColor: 'hsl(248, 70%, 50%)'
		// }
// ]

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
