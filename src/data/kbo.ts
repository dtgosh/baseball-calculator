// ---- KBO win-probability calculator: shared constants, helpers, and sample data ----
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

// ---- fixed model constants (homeAdv=4, eraWeight=1, showBreakdown=true baked in) ----
export const HOME_ADV = 4 / 100;
export const ERA_WEIGHT = 1;

export const num = (v: string, d: number) => {
	const n = parseFloat(v);
	return isFinite(n) ? n : d;
};

export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export const wStat = (list: { [k: string]: string }[], key: string, def: number, lo: number, hi: number) => {
	let sw = 0,
		so = 0;
	list.forEach((b, i) => {
		const o = clamp(num(b[key], def), lo, hi);
		so += o * W9[i];
		sw += W9[i];
	});
	return sw > 0 ? so / sw : def;
};

const bat = (rows: [string, string, string, string][]) =>
	rows.map((r) => ({ name: r[0], avg: r[1], ops: r[2], sb: r[3] }));
const arm = (rows: [string, string, string, string][]) =>
	rows.map((r) => ({ name: r[0], era: r[1], whip: r[2], k9: r[3] }));

export const initRoster = () => ({
	away: {
		bat: bat([
			['김지환', '0.302', '0.842', '21'],
			['박세진', '0.288', '0.815', '14'],
			['이현우', '0.295', '0.878', '8'],
			['최민준', '0.310', '0.901', '5'],
			['정재윤', '0.276', '0.796', '11'],
			['오승민', '0.265', '0.744', '6'],
			['한도윤', '0.258', '0.712', '9'],
			['임규현', '0.249', '0.688', '4'],
			['송지호', '0.241', '0.655', '12'],
		]),
		arms: arm([
			['문세혁', '3.42', '1.18', '8.9'],
			['정해일', '3.85', '1.28', '8.2'],
			['구자혁', '4.10', '1.31', '7.6'],
			['민동엽', '4.32', '1.36', '7.2'],
			['채상윤', '2.88', '1.09', '9.8'],
		]),
		bench: bat([
			['강태민', '0.262', '0.712', '3'],
			['유정호', '0.255', '0.688', '5'],
			['신재웅', '0.248', '0.665', '2'],
			['곽민서', '0.240', '0.641', '6'],
		]),
	},
	home: {
		bat: bat([
			['이강준', '0.294', '0.822', '17'],
			['김태오', '0.285', '0.801', '12'],
			['박준서', '0.301', '0.865', '6'],
			['최우진', '0.307', '0.884', '4'],
			['장하람', '0.272', '0.780', '9'],
			['윤세찬', '0.263', '0.735', '7'],
			['강민재', '0.256', '0.702', '5'],
			['조현탁', '0.247', '0.671', '3'],
			['백승우', '0.243', '0.658', '8'],
		]),
		arms: arm([
			['배성준', '3.78', '1.24', '8.1'],
			['홍기표', '3.92', '1.26', '8.4'],
			['전성규', '4.18', '1.33', '7.4'],
			['양지훈', '4.40', '1.38', '6.9'],
			['국영호', '3.05', '1.12', '9.3'],
		]),
		bench: bat([
			['남기훈', '0.259', '0.705', '2'],
			['도상원', '0.252', '0.682', '4'],
			['문진우', '0.246', '0.659', '1'],
			['서병규', '0.238', '0.635', '3'],
		]),
	},
});
