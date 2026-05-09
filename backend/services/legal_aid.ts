export interface LegalAidResult {
  form_type: string;
  status: string;
  nearest_dlsa: string;
  recommended_action: string;
  documents_hint: string[];
}

export interface ChecklistItem {
  title: string;
  required: boolean;
  notes: string | null;
}

export function buildLegalAid(offenceName: string): LegalAidResult {
  return {
    form_type: "NALSA Form 1",
    status: "draft_ready",
    nearest_dlsa: "Bengaluru Urban District Legal Services Authority",
    recommended_action: `Prepare a legal aid request for ${offenceName}.`,
    documents_hint: [
      "Identity proof of applicant",
      "Basic arrest details",
      "Known FIR details, if available",
    ],
  };
}

export function buildChecklist(): ChecklistItem[] {
  return [
    {
      title: "FIR copy",
      required: true,
      notes: "Ask for FIR number if unavailable",
    },
    {
      title: "Arrest memo",
      required: true,
      notes: "Verify time and arrest location",
    },
    {
      title: "ID proof of family member",
      required: true,
      notes: null,
    },
    {
      title: "Address proof",
      required: false,
      notes: null,
    },
  ];
}
