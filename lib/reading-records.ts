export type ReadingRecord = {
  title: string;
  author: string;
  description: string;
  status: "reading" | "finished" | "paused";
  area: string;
  date: string;
  memoUrl?: string;
  cover?: string;
};

export const readingAreas = [
  "技術書",
  "設計",
  "英語",
  "韓国語",
  "キャリア",
  "思考法",
];

export function getReadingRecords(): ReadingRecord[] {
  return [];
}
