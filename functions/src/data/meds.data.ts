export const MedMap = {
  lisinopril: {
    indication: "hypertension",
    overdose: "overdose can result in hypotension",
    foodIteraction:
      "Avoid potassium-containing products. Potassium products increase the risk of hyperkalemia.",
    drugIteraction:
      "Lisinopril may decrease the excretion rate of Abacavir which could result in a higher serum level.",
  },

  hydrochlorothiazide: {
    indicator: "hypertension",
    overdose:
      "overdose can result in hypokalemia, hypochloremia, and hyponatremia",
    foodIteraction:
      "Avoid alcohol. Alcohol may potentiate orthostatic hypotension.",
    drugIteraction:
      "Hydrochlorothiazide may increase the excretion rate of Abacavir which could result in a lower serum level and potentially a reduction in efficacy.",
  },
  amlodipine: {
    indicator: "hypertension",
    overdose:
      "overdose can result in high degree of peripheral vasodilatation with a possibility of reflex tachycardia",
    foodIteraction: "Avoid grapefruit products.",
    drugIteraction:
      "The risk or severity of hypoglycemia can be increased when Amlodipine is combined with Acarbose.",
  },
  losartan: {
    indicator: "hypertension",
    overdose: "overdose can result in hypotension, tachycardia, or bradycardia",
    drugIteraction:
      "The metabolism of Losartan can be increased when combined with Abatacept.",
    foodIteraction:
      "Take with or without food. Food delays absorption, but does not affect the extent of absorption",
  },
  metformin: {
    indicator: "diabetes",
    overdose: "overdose can result in lactic acidosis",
    drugIteraction:
      "The risk or severity of lactic acidosis can be increased when Acetazolamide is combined with Metformin.",
    foodIteraction: "Avoid alcohol.",
  },
  sitagliptin: {
    indicator: "diabetes",
    overdose:
      "Sitagliptin has also been associated with a 34% relative risk increase for all cause infection",
    drugIteraction:
      "Acemetacin may decrease the excretion rate of Sitagliptin which could result in a higher serum level",
    foodIteraction: "Take with or without food.",
  },
  pioglitazone: {
    indicator: "diabetes",
    overdose: "no symptom yet",
    drugIteraction:
      "The metabolism of Pioglitazone can be increased when combined with Adalimumab",
    foodIteraction:
      "Take with or without food. Food delays drug absorption, but not to a clinically significant extent",
  },
  glipizide: {
    indicator: "diabetes",
    overdose:
      "Symptoms of overdose in sulfonylureas, including glipizide, may be related to severe hypoglycemia and may include coma, seizure, or other neurological impairment",
    drugIteraction:
      "The therapeutic efficacy of Acenocoumarol can be increased when used in combination with Glipizide.",
    foodIteraction:
      "Avoid excessive or chronic alcohol consumption. The risk of hypoglycemia is increased when alcohol is ingested.",
  },
} as const;

interface MedDataSchema {
  indicator: string;
  overdose: string;
  drugIteraction: string;
  foodIteraction: string;
}
export type MedKey = keyof typeof MedMap;
export type MedData = typeof MedMap[MedKey] & MedDataSchema;
