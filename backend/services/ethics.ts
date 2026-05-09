export interface EthicsResult {
  blocked: boolean;
  reason: string;
  redirect_target: string | null;
}

export function evaluateEthics(text: string): EthicsResult {
  const normalized = text.toLowerCase();
  
  // HEINOUS CRIMES REDIRECT (Murder/Rape/Terrorism)
  const heinousKeywords = ["kill", "murder", "rape", "terrorism", "bomb", "blast", "homicide", "sexual assault"];
  
  if (heinousKeywords.some(keyword => normalized.includes(keyword))) {
    return {
      blocked: true,
      reason: "Heinous Crime Detected: Your case involves high-severity offences. DIY bail tools are disabled for these categories. Please contact a Senior Legal Aid Counsel immediately.",
      redirect_target: "/senior-counsel-referral",
    };
  }

  if (normalized.includes("bribe") || normalized.includes("corruption")) {
    return {
      blocked: true,
      reason: "The request involves unethical solicitation or bribery which violates our legal safety standards.",
      redirect_target: "/ethics-policy",
    };
  }

  return {
    blocked: false,
    reason: "No ethics hard-stop triggered.",
    redirect_target: null,
  };
}
