interface UseCase {
	space: string;
	checkboxes: string[];
		customer_name: string;
		author_name: string;
		number_in_parent: number;
		date: string;
		title: string;
	[key: string]: unknown;
}

export function groupAndAnalyzeUseCasesBySpace(useCases: UseCase[]) {
	const bySpace: Record<string, UseCase[]> = {};
		// const byCustomer: Record<string, UseCase[]> = {};
		// const byAuthor: Record<string, UseCase[]> = {};

	useCases.forEach((uc) => {
		if (!bySpace[uc.space]) bySpace[uc.space] = [];
		bySpace[uc.space].push(uc);
		// 	if (!byCustomer[uc.customer_name]) byCustomer[uc.customer_name] = [];
		// byCustomer[uc.customer_name].push(uc);
	});

	const analysis = Object.entries(bySpace).map(([space, cases]) => {
		const accepted = cases.filter(c => c.checkboxes.includes('Accepted')).length;
		const included = cases.filter(c => c.checkboxes.includes('Included in Prd')).length;
		const inReview = cases.filter(c => c.checkboxes.includes('In Review')).length;
		const rejected = cases.filter(c => c.checkboxes.includes('Rejected')).length;

		return {
			space,
            cases: cases,
			total: cases.length,
			byCategory: {
				unprocessed: cases.length - (accepted + included + inReview + rejected),
			accepted,
			included,
			inReview,
			rejected,
			},
			percentProcessed: Math.round(((accepted + included + inReview + rejected) / cases.length) * 100)
		};
	});

	return { analysis };
}

const explodeCheckboxes = (cases: UseCase[]) => {
	const accepted = cases.filter(c => c.checkboxes.includes('Accepted')).length;
	const included = cases.filter(c => c.checkboxes.includes('Included in Prd')).length;
	const inReview = cases.filter(c => c.checkboxes.includes('In Review')).length;
	const rejected = cases.filter(c => c.checkboxes.includes('Rejected')).length;
	return {
		accepted, included, inReview, rejected
	}
}

export function groupAndAnalyzeUseCasesByAuthor(useCases: UseCase[]) {
	const byAuthor: Record<string, UseCase[]> = {};

	useCases.forEach((uc) => {
		if (!byAuthor[uc.author_name]) byAuthor[uc.author_name] = [];
		byAuthor[uc.author_name].push(uc);
	});

    console.log('byAuthor', byAuthor);

	const analysis = Object.entries(byAuthor).map(([author, cases]) => {
		const { accepted, included, inReview, rejected } = explodeCheckboxes(cases);

		return {
			author,
            cases: cases,
			total: cases.length,
			byCategory: {
				unprocessed: cases.length - (accepted + included + inReview + rejected),
			accepted,
			included,
			inReview,
			rejected,
			},
			percentProcessed: Math.round(((accepted + included + inReview + rejected) / cases.length) * 100)
		};
	});

	return { analysis };
}
