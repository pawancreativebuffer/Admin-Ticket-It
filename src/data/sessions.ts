// dummy session usage rows for the Use Report page (taken from the legacy screenshot)
export type SessionRow = {
  user: string;
  address: string;
  client: string;
  region: string;
  start: string;
  end: string;
  adhocCreated: number;
  adhocModified: number;
  adhocPrinted: number;
  accountViewed: number;
  batchViewed: number;
  batchPrinted: number;
  batchModified: number;
};

const row = (
  user: string,
  address: string,
  client: string,
  region: string,
  start: string,
  end: string,
  counts: [number, number, number, number, number, number, number]
): SessionRow => ({
  user,
  address,
  client,
  region,
  start,
  end,
  adhocCreated: counts[0],
  adhocModified: counts[1],
  adhocPrinted: counts[2],
  accountViewed: counts[3],
  batchViewed: counts[4],
  batchPrinted: counts[5],
  batchModified: counts[6],
});

const MELBOURNE = "21 Degraves Street Melbourne";

export const sessions: SessionRow[] = [
  row("ST1.SeniorArt - Luke Senior", "n/a", "SeniorArt", "Head Office", "8/10/2026 - 2:23 pm", "8/10/2026 - 2:30 pm", [1, 0, 1, 0, 2, 0, 0]),
  row("ST1.SeniorArt - Luke Senior", "n/a", "SeniorArt", "Head Office", "8/10/2026 - 4:53 pm", "8/10/2026 - 6:08 pm", [1, 0, 1, 0, 3, 0, 0]),
  row("frankston@seniorart.com.au - Store User", "-", "SeniorArt", "Master", "8/10/2026 - 1:06 pm", "8/10/2026 - 1:08 pm", [1, 0, 1, 0, 2, 0, 0]),
  row("frankston@seniorart.com.au - Store User", "-", "SeniorArt", "Master", "12/10/2026 - 4:11 pm", "12/10/2026 - 5:01 pm", [2, 0, 0, 0, 4, 0, 1]),
  row("malvern@seniorart.com.au - Store User", "-", "SeniorArt", "Master", "10/10/2026 - 1:23 pm", "10/10/2026 - 1:24 pm", [0, 0, 2, 0, 1, 0, 0]),
  row("melbourne@seniorart.com.au - Senior Art Supplies Melbourne", MELBOURNE, "SeniorArt", "Master", "8/10/2026 - 3:59 pm", "8/10/2026 - 7:32 pm", [0, 0, 4, 0, 0, 0, 0]),
  row("melbourne@seniorart.com.au - Senior Art Supplies Melbourne", MELBOURNE, "SeniorArt", "Master", "10/10/2026 - 3:51 pm", "10/10/2026 - 5:08 pm", [42, 0, 5, 0, 4, 0, 0]),
  row("melbourne@seniorart.com.au - Senior Art Supplies Melbourne", MELBOURNE, "SeniorArt", "Master", "13/10/2026 - 2:12 pm", "13/10/2026 - 3:14 pm", [5, 0, 1, 0, 3, 0, 0]),
  row("melbourne@seniorart.com.au - Senior Art Supplies Melbourne", MELBOURNE, "SeniorArt", "Master", "13/10/2026 - 4:53 pm", "13/10/2026 - 4:55 pm", [0, 0, 2, 0, 1, 0, 0]),
  row("melbourne@seniorart.com.au - Senior Art Supplies Melbourne", MELBOURNE, "SeniorArt", "Master", "14/10/2026 - 10:29 am", "14/10/2026 - 10:30 am", [0, 0, 1, 0, 1, 0, 0]),
  row("melbourne@seniorart.com.au - Senior Art Supplies Melbourne", MELBOURNE, "SeniorArt", "Master", "15/10/2026 - 10:52 am", "15/10/2026 - 2:35 pm", [7, 1, 4, 0, 9, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "8/10/2026 - 12:04 pm", "8/10/2026 - 12:04 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "8/10/2026 - 4:23 pm", "8/10/2026 - 4:23 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "8/10/2026 - 6:56 pm", "8/10/2026 - 6:56 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "9/10/2026 - 11:23 am", "9/10/2026 - 11:31 am", [0, 0, 0, 0, 1, 0, 7]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "12/10/2026 - 11:17 am", "12/10/2026 - 11:57 am", [0, 0, 0, 0, 4, 0, 4]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "12/10/2026 - 4:01 pm", "12/10/2026 - 4:01 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "12/10/2026 - 4:04 pm", "12/10/2026 - 5:03 pm", [0, 0, 0, 0, 2, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "13/10/2026 - 12:49 pm", "13/10/2026 - 12:49 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "13/10/2026 - 12:49 pm", "13/10/2026 - 12:51 pm", [0, 0, 0, 0, 2, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "13/10/2026 - 12:54 pm", "13/10/2026 - 12:54 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "14/10/2026 - 12:41 pm", "14/10/2026 - 12:41 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "14/10/2026 - 12:42 pm", "14/10/2026 - 12:42 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "14/10/2026 - 1:26 pm", "14/10/2026 - 1:26 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "15/10/2026 - 12:33 pm", "15/10/2026 - 12:33 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.AstuteGroup - Store User", "n/a", "AstuteGroup", "Head Office", "15/10/2026 - 2:11 pm", "15/10/2026 - 2:15 pm", [0, 0, 0, 0, 2, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "8/10/2026 - 10:56 am", "8/10/2026 - 10:56 am", [0, 0, 0, 0, 1, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "8/10/2026 - 10:59 am", "8/10/2026 - 12:48 pm", [4, 1, 4, 0, 7, 0, 2]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "8/10/2026 - 11:03 am", "8/10/2026 - 11:09 am", [1, 0, 1, 0, 2, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "8/10/2026 - 2:41 pm", "8/10/2026 - 2:44 pm", [0, 1, 1, 0, 2, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "8/10/2026 - 2:47 pm", "8/10/2026 - 2:55 pm", [0, 3, 4, 0, 6, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "8/10/2026 - 4:24 pm", "8/10/2026 - 4:27 pm", [0, 2, 2, 0, 3, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "12/10/2026 - 1:36 pm", "12/10/2026 - 1:41 pm", [0, 2, 2, 0, 3, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "12/10/2026 - 1:42 pm", "12/10/2026 - 1:47 pm", [1, 0, 1, 0, 2, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "12/10/2026 - 1:42 pm", "12/10/2026 - 1:44 pm", [0, 1, 1, 0, 3, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "14/10/2026 - 9:57 am", "14/10/2026 - 10:08 am", [0, 5, 5, 0, 7, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "15/10/2026 - 12:41 pm", "15/10/2026 - 1:54 pm", [0, 1, 1, 0, 3, 0, 0]),
  row("ST1.SurefireSystems - Store User", "n/a", "SurefireSystems", "Head Office", "15/10/2026 - 2:47 pm", "15/10/2026 - 3:37 pm", [0, 7, 7, 0, 8, 0, 0]),
  row("ST.GASBreamBay - Store User", "n/a", "GasPetrol", "Head Office", "14/10/2026 - 2:26 pm", "14/10/2026 - 2:26 pm", [0, 0, 0, 0, 1, 0, 0]),
  row("ST.GASBreamBay - Store User", "n/a", "GasPetrol", "Head Office", "14/10/2026 - 2:27 pm", "14/10/2026 - 2:27 pm", [0, 0, 0, 0, 1, 0, 0]),
];
