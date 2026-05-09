export interface ClassificationResult {
  offence_name: string;
  bns_code: string;
  bailable: boolean | null;
  confidence: number;
  police_station_hint: string;
}

export function classifyIncident(text: string): ClassificationResult {
  const normalized = text.toLowerCase();

  if (normalized.includes("fight") || normalized.includes("hurt")) {
    return {
      offence_name: "Minor Hurt / Fight",
      bns_code: "BNS-115",
      bailable: true,
      confidence: 0.82,
      police_station_hint: "Nearest jurisdictional police station",
    };
  }

  if (normalized.includes("theft") || normalized.includes("stole")) {
    return {
      offence_name: "Petty Theft",
      bns_code: "BNS-303",
      bailable: true,
      confidence: 0.81,
      police_station_hint: "Nearest jurisdictional police station",
    };
  }

  return {
    offence_name: "Unclassified Complaint",
    bns_code: "UNKNOWN",
    bailable: null,
    confidence: 0.40,
    police_station_hint: "Nearest jurisdictional police station",
  };
}
