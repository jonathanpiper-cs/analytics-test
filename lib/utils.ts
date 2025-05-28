export const headers = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

export const auth = {
	...headers,
	Authorization: 'Basic ' + Buffer.from(process.env.EMAIL + ":" + process.env.API_TOKEN).toString('base64')
};

export async function getLabel(name: string) {
	const url = `${process.env.V1_BASE_URL!}label?name=${name}`;
	const response = await fetch(url, { headers: auth });
	const data = await response.json();
	return data.label;
}

export async function getSpace(id: string) {
	const url = `${process.env.BASE_URL!}spaces/${id}`;
	const response = await fetch(url, { headers: auth });
	const data = await response.json();
	return data.name;
}

export function hexToHSL(H: string) {
	// Convert hex to RGB first
	let r: number = 0
	let g: number = 0 
	let b: number = 0;
	if (H.length == 4) {
		r = parseInt(H[1] + H[1], 16);
		g = parseInt(H[2] + H[2], 16);
		b = parseInt(H[3] + H[3], 16);
	} else if (H.length == 7) {
		r = parseInt(H[1] + H[2], 16);
		g = parseInt(H[3] + H[4], 16);
		b = parseInt(H[5] + H[6], 16);
	}
	// Then to HSL
	r /= 255;
	g /= 255;
	b /= 255;
	const cmin = Math.min(r,g,b),
		cmax = Math.max(r,g,b),
		delta = cmax - cmin
		let
			h = 0,
			s = 0,
			l = 0;

	if (delta == 0)
		h = 0;
	else if (cmax == r)
		h = ((g - b) / delta) % 6;
	else if (cmax == g)
		h = (b - r) / delta + 2;
	else
		h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0)
		h += 360;

	l = (cmax + cmin) / 2;
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return "hsl(" + h + "," + s + "%," + l + "%)";
}

export const LABELS = {
	'accepted': {"legend": "Accepted", "color": "#6a9a23"},
	'included': {"legend": 'Included in PRD', "color": "#dcdfe4"},
	'inReview': {"legend": "In Review", "color": "#fedec8"},
	'rejected': {"legend": "Rejected", "color": "#fdd0ec"},
	'unprocessed': {"legend": "Unprocessed", "color": "#7d818a"},
}

export const NivoTheme = {
    "text": {
        "fontSize": 11,
        "fill": "#eeeeee",
        "outlineWidth": 0,
        "outlineColor": "#ffffff"
    },
    "axis": {
        "domain": {
            "line": {
                "stroke": "#777777",
                "strokeWidth": 1
            }
        },
        "legend": {
            "text": {
                "fontSize": 12,
                "fill": "#eeeeee",
                "outlineWidth": 0,
                "outlineColor": "#ffffff"
            }
        },
        "ticks": {
            "line": {
                "stroke": "#777777",
                "strokeWidth": 1
            },
            "text": {
                "fontSize": 11,
                "fill": "#eeeeee",
                "outlineWidth": 0,
                "outlineColor": "#ffffff"
            }
        }
    },
    "grid": {
        "line": {
            "stroke": "#dddddd",
            "strokeWidth": 1
        }
    },
    "legends": {
        "title": {
            "text": {
                "fontSize": 11,
                "fill": "#eeeeee",
                "outlineWidth": 0,
                "outlineColor": "#ffffff"
            }
        },
        "text": {
            "fontSize": 11,
            "fill": "#333333",
            "outlineWidth": 0,
            "outlineColor": "#ffffff"
        },
        "ticks": {
            "line": {},
            "text": {
                "fontSize": 10,
                "fill": "#333333",
                "outlineWidth": 0,
                "outlineColor": "#ffffff"
            }
        }
    },
    "annotations": {
        "text": {
            "fontSize": 13,
            "fill": "#eeeeee",
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "link": {
            "stroke": "#000000",
            "strokeWidth": 1,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "outline": {
            "stroke": "#000000",
            "strokeWidth": 2,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "symbol": {
            "fill": "#000000",
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        }
    },
    "tooltip": {
        "wrapper": {},
        "container": {
            "background": "#ffffff",
            "color": "#333333",
            "fontSize": 12
        },
        "basic": {},
        "chip": {},
        "table": {},
        "tableCell": {},
        "tableCellValue": {}
    }
}