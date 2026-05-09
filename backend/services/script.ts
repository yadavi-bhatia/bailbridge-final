export interface ScriptResult {
  en: string;
  hi: string;
  kn: string;
  scenarios: {
    police: { en: string; hi: string; kn: string };
    court: { en: string; hi: string; kn: string };
    legal_aid: { en: string; hi: string; kn: string };
  };
}

export function buildScripts(offenceName: string, isFirstOffender: boolean = true): ScriptResult {
  const firstOffenderNote = isFirstOffender 
    ? "This is the person's first time in custody, which qualifies them for the 1/3rd detention rule under BNSS Section 479."
    : "The person is a previous offender, so standard bail protocols apply.";

  const firstOffenderNoteHi = isFirstOffender
    ? "यह व्यक्ति पहली बार हिरासत में है, जो उन्हें बीएनएसएस धारा 479 के तहत 1/3 हिरासत नियम के लिए पात्र बनाता है।"
    : "यह व्यक्ति पहले भी आरोपी रहा है, इसलिए मानक जमानत प्रोटोकॉल लागू होते हैं।";

  const firstOffenderNoteKn = isFirstOffender
    ? "ಈ ವ್ಯಕ್ತಿ ಮೊದಲ ಬಾರಿಗೆ ಕಸ್ಟಡಿಯಲ್ಲಿದ್ದಾರೆ, ಇದು BNSS ಸೆಕ್ಷನ್ 479 ರ ಅಡಿಯಲ್ಲಿ ಅವರಿಗೆ 1/3 ಬಂಧನ ನಿಯಮಕ್ಕೆ ಅರ್ಹತೆ ನೀಡುತ್ತದೆ."
    : "ಈ ವ್ಯಕ್ತಿ ಈ ಹಿಂದೆ ಅಪರಾಧಿಯಾಗಿದ್ದಾರೆ, ಆದ್ದರಿಂದ ಪ್ರಮಾಣಿತ ಜಾಮೀನು ಪ್ರೋಟೋಕಾಲ್‌ಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.";

  return {
    en: `My family member has been detained regarding ${offenceName}. ${firstOffenderNote} We request information on the grounds of arrest and a copy of the arrest memo.`,
    hi: `मेरे परिवार के सदस्य को ${offenceName} के संबंध में हिरासत में लिया गया है। ${firstOffenderNoteHi} हम गिरफ्तारी के आधार और गिरफ्तारी मेमो की एक प्रति की जानकारी मांगते हैं।`,
    kn: `ನಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರನ್ನು ${offenceName} ಸಂಬಂಧವಾಗಿ ಬಂಧಿಸಲಾಗಿದೆ. ${firstOffenderNoteKn} ನಾವು ಬಂಧನದ ಆಧಾರದ ಬಗ್ಗೆ ಮಾಹಿತಿ ಮತ್ತು ಬಂಧನ ಮೆಮೊದ ಪ್ರತಿಯನ್ನು ವಿನಂತಿಸುತ್ತೇವೆ.`,
    scenarios: {
      police: {
        en: `Specifically regarding the ${offenceName} allegation at this station: We are following the D.K. Basu guidelines. Has a friend or family member been officially notified? We demand the right to legal consultation.`,
        hi: `विशेष रूप से इस स्टेशन पर ${offenceName} के आरोप के संबंध में: हम डी.के. बसु दिशानिर्देशों का पालन कर रहे हैं। क्या किसी मित्र या परिवार के सदस्य को आधिकारिक तौर पर सूचित किया गया है? हम कानूनी परामर्श के अधिकार की मांग करते हैं।`,
        kn: `ವಿಶೇಷವಾಗಿ ಈ ಠಾಣೆಯಲ್ಲಿ ${offenceName} ಆರೋಪದ ಬಗ್ಗೆ: ನಾವು ಡಿ.ಕೆ. ಬಸು ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಅನುಸರಿಸುತ್ತಿದ್ದೇವೆ. ಸ್ನೇಹಿತ ಅಥವಾ ಕುಟುಂಬದ ಸದಸ್ಯರಿಗೆ ಅಧಿಕೃತವಾಗಿ ತಿಳಿಸಲಾಗಿದೆಯೇ? ನಾವು ಕಾನೂನು ಸಮಾಲೋಚನೆಯ ಹಕ್ಕನ್ನು ಒತ್ತಾಯಿಸುತ್ತೇವೆ.`
      },
      court: {
        en: `Your Honor, regarding the case of ${offenceName}: The accused is a first-time offender (Section 479 BNSS). We emphasize that the investigation has reached a stage where further custody is not required for the ${offenceName} probe.`,
        hi: `हुज़ूर, ${offenceName} के मामले में: आरोपी पहली बार अपराधी है (धारा 479 बीएनएसएस)। हम इस बात पर ज़ोर देते हैं कि जांच उस स्तर पर पहुँच गई है जहाँ ${offenceName} की जांच के लिए और हिरासत की आवश्यकता नहीं है।`,
        kn: `ಗೌರವಾನ್ವಿತ ನ್ಯಾಯಾಧೀಶರೇ, ${offenceName} ಪ್ರಕರಣದ ಬಗ್ಗೆ: ಆರೋಪಿಯು ಮೊದಲ ಬಾರಿಗೆ ಅಪರಾಧಿ (ಸೆಕ್ಷನ್ 479 BNSS). ತನಿಖೆಯು ${offenceName} ವಿಚಾರಣೆಗಾಗಿ ಹೆಚ್ಚಿನ ಕಸ್ಟಡಿ ಅಗತ್ಯವಿಲ್ಲದ ಹಂತವನ್ನು ತಲುಪಿದೆ ಎಂದು ನಾವು ಒತ್ತಿಹೇಳುತ್ತೇವೆ.`
      },
      legal_aid: {
        en: `We need help with a ${offenceName} case. The accused is eligible for Article 39A free legal aid. Current situation: ${offenceName} allegation, ${isFirstOffender ? 'First offender' : 'Prior history'}.`,
        hi: `हमें ${offenceName} मामले में मदद चाहिए। आरोपी अनुच्छेद 39A मुफ्त कानूनी सहायता के लिए पात्र है। वर्तमान स्थिति: ${offenceName} का आरोप, ${isFirstOffender ? 'पहला अपराध' : 'पिछला इतिहास'}।`,
        kn: `${offenceName} ಪ್ರಕರಣದಲ್ಲಿ ನಮಗೆ ಸಹಾಯ ಬೇಕು. ಆರೋಪಿಯು ಲೇಖ 39A ಉಚಿತ ಕಾನೂನು ಸಹಾಯಕ್ಕೆ ಅರ್ಹರಾಗಿದ್ದಾರೆ. ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿ: ${offenceName} ಆರೋಪ, ${isFirstOffender ? 'ಮೊದಲ ಅಪರಾಧ' : 'ಹಿಂದಿನ ಇತಿಹಾಸ'}.`
      }
    }
  };
}
