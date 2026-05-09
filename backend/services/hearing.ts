export interface HearingResult {
  cnr_number: string;
  next_hearing_date: string;
  court_name: string;
  room_number: string;
  source: string;
}

export function getMockHearing(): HearingResult {
  return {
    cnr_number: "BB-CNR-001",
    next_hearing_date: "2026-05-20",
    court_name: "Bengaluru Metropolitan Magistrate Court",
    room_number: "Court Hall 3",
    source: "mockapi",
  };
}
