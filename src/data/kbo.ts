// Framework-agnostic plain TS -- importable from both the Astro frontmatter (build-time)
// and the client <script> (browser, bundled by Vite). No DOM or Node-specific APIs.

export const L = { rpg: 5.15, ops: 0.735, avg: 0.265, era: 4.6, whip: 1.32, k9: 7.4, der: 0.69, sr: 70 };

export const TEAMS = [
	'LG 트윈스',
	'한화 이글스',
	'KIA 타이거즈',
	'삼성 라이온즈',
	'두산 베어스',
	'SSG 랜더스',
	'NC 다이노스',
	'롯데 자이언츠',
	'KT 위즈',
	'키움 히어로즈',
];

export const W9 = [1.1, 1.07, 1.05, 1.03, 1.0, 0.97, 0.95, 0.92, 0.9];

export const ROLES = ['선발', '중계1', '중계2', '중계3', '마무리'];

export const ACCENT = {
	away: 'oklch(0.50 0.13 40)',
	home: 'oklch(0.50 0.13 255)',
};

export const HOME_ADV = 4 / 100;
export const ERA_WEIGHT = 1;

export const num = (v: string, d: number) => {
	const n = parseFloat(v);
	return isFinite(n) ? n : d;
};

export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export const wStat = (list: { [k: string]: string }[], valueOf: (b: { [k: string]: string }) => number, def: number, lo: number, hi: number) => {
	let sw = 0,
		so = 0;
	list.forEach((b, i) => {
		const o = clamp(valueOf(b), lo, hi);
		so += o * W9[i];
		sw += W9[i];
	});
	return sw > 0 ? so / sw : def;
};

// 순수 기록 -> 파생 지표 계산
// 타수(AB)는 그 자체로 순수 기록이 아니라 타석(PA)에서 볼넷/사구/희생플라이를 제외해 파생되는 값
const deriveAb = (b: { [k: string]: string }) => {
	const pa = num(b.pa, 0);
	const bb = num(b.bb, 0);
	const hbp = num(b.hbp, 0);
	const sf = num(b.sf, 0);
	return Math.max(0, pa - bb - hbp - sf);
};

export const battingAvg = (b: { [k: string]: string }, def: number) => {
	const ab = deriveAb(b);
	if (ab <= 0) return def;
	return num(b.h, 0) / ab;
};

export const battingOps = (b: { [k: string]: string }, def: number) => {
	const ab = deriveAb(b);
	const pa = num(b.pa, 0);
	const h = num(b.h, 0);
	const d2 = num(b.d2, 0);
	const d3 = num(b.d3, 0);
	const hr = num(b.hr, 0);
	const bb = num(b.bb, 0);
	const hbp = num(b.hbp, 0);
	if (ab <= 0 || pa <= 0) return def;
	const obp = (h + bb + hbp) / pa;
	const singles = Math.max(0, h - d2 - d3 - hr);
	const tb = singles + d2 * 2 + d3 * 3 + hr * 4;
	const slg = tb / ab;
	return obp + slg;
};

export const pitchingEra = (p: { [k: string]: string }, def: number) => {
	const ip = num(p.ip, 0);
	if (ip <= 0) return def;
	return (num(p.er, 0) * 9) / ip;
};

export const pitchingWhip = (p: { [k: string]: string }, def: number) => {
	const ip = num(p.ip, 0);
	if (ip <= 0) return def;
	return (num(p.h, 0) + num(p.bb, 0)) / ip;
};

export const pitchingK9 = (p: { [k: string]: string }, def: number) => {
	const ip = num(p.ip, 0);
	if (ip <= 0) return def;
	return (num(p.k, 0) * 9) / ip;
};

const bat = (rows: [string, string, string, string, string, string, string, string, string, string][]) =>
	rows.map((r) => ({
		name: r[0],
		pa: r[1],
		h: r[2],
		d2: r[3],
		d3: r[4],
		hr: r[5],
		bb: r[6],
		hbp: r[7],
		sf: r[8],
		sb: r[9],
	}));
const arm = (rows: [string, string, string, string, string, string][]) =>
	rows.map((r) => ({ name: r[0], ip: r[1], h: r[2], bb: r[3], er: r[4], k: r[5] }));

export const initRoster = () => ({
	away: {
		bat: bat([
			['김지환', '555', '151', '58', '2', '9', '45', '5', '5', '21'],
			['박세진', '555', '144', '58', '2', '9', '45', '5', '5', '14'],
			['이현우', '555', '148', '76', '2', '11', '45', '5', '5', '8'],
			['최민준', '555', '155', '74', '2', '11', '45', '5', '5', '5'],
			['정재윤', '555', '138', '60', '2', '9', '45', '5', '5', '11'],
			['오승민', '555', '133', '51', '1', '7', '45', '5', '5', '6'],
			['한도윤', '555', '129', '43', '1', '7', '45', '5', '5', '9'],
			['임규현', '555', '125', '41', '1', '6', '45', '5', '5', '4'],
			['송지호', '555', '121', '35', '1', '5', '45', '5', '5', '12'],
		]),
		arms: arm([
			['문세혁', '160', '123', '66', '61', '158'],
			['정해일', '70', '59', '31', '30', '64'],
			['구자혁', '65', '55', '30', '30', '55'],
			['민동엽', '60', '53', '29', '29', '48'],
			['채상윤', '55', '39', '21', '18', '60'],
		]),
		bench: bat([
			['강태민', '168', '39', '13', '0', '2', '14', '2', '2', '3'],
			['유정호', '168', '38', '11', '0', '2', '14', '2', '2', '5'],
			['신재웅', '168', '37', '9', '0', '2', '14', '2', '2', '2'],
			['곽민서', '168', '36', '11', '0', '1', '14', '2', '2', '6'],
		]),
	},
	home: {
		bat: bat([
			['이강준', '555', '147', '56', '2', '9', '45', '5', '5', '17'],
			['김태오', '555', '143', '56', '2', '8', '45', '5', '5', '12'],
			['박준서', '555', '151', '66', '2', '10', '45', '5', '5', '6'],
			['최우진', '555', '154', '70', '2', '10', '45', '5', '5', '4'],
			['장하람', '555', '136', '55', '2', '9', '45', '5', '5', '9'],
			['윤세찬', '555', '132', '49', '1', '7', '45', '5', '5', '7'],
			['강민재', '555', '128', '43', '1', '6', '45', '5', '5', '5'],
			['조현탁', '555', '124', '35', '1', '6', '45', '5', '5', '3'],
			['백승우', '555', '122', '35', '1', '5', '45', '5', '5', '8'],
		]),
		arms: arm([
			['배성준', '160', '129', '69', '67', '144'],
			['홍기표', '70', '57', '31', '30', '65'],
			['전성규', '65', '56', '30', '30', '53'],
			['양지훈', '60', '54', '29', '29', '46'],
			['국영호', '55', '40', '22', '19', '57'],
		]),
		bench: bat([
			['남기훈', '168', '39', '12', '0', '2', '14', '2', '2', '2'],
			['도상원', '168', '38', '10', '0', '2', '14', '2', '2', '4'],
			['문진우', '168', '37', '9', '0', '2', '14', '2', '2', '1'],
			['서병규', '168', '36', '10', '0', '1', '14', '2', '2', '3'],
		]),
	},
});
