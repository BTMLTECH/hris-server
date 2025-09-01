export type FundType = "Fund I" | "Fund II" | "Fund III" | "Fund IV" | "Fund V" | "Fund VI";

type PensionFund = {
  pfa: string;
  funds: Partial<Record<FundType, number | null>>;
};

export const pensionFundData: PensionFund[] = [
  {
    pfa: "Trustfund Pensions Limited",
    funds: { "Fund I": 2.9060, "Fund II": 8.6365, "Fund III": 2.3140, "Fund IV": 6.2515, "Fund V": 1.9976 }
  },
  {
    pfa: "FCMB Pensions Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null }
  },
  {
    pfa: "Fidelity Pension Managers Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null }
  },
  {
    pfa: "Guaranty Trust Pension Managers Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null }
  },
  {
    pfa: "Leadway Pensure PFA Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null }
  },
  {
    pfa: "Premium Pension Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null }
  },
  {
    pfa: "Access ARM Pensions Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null, "Fund VI": null }
  },
  {
    pfa: "Stanbic IBTC Pension Managers Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null }
  },
  {
    pfa: "Crusader Sterling Pensions Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null }
  },
  {
    pfa: "Tangerine APT Pensions Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null }
  },
  {
    pfa: "Norrenberger Pensions Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null, "Fund V": null }
  },
  {
    pfa: "Nigerian University Pension Management Company (NUPEMCO)",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null }
  },
  {
    pfa: "NLPC Pension Fund Administrators Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null }
  },
  {
    pfa: "NPF Pension Managers Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null }
  },
  {
    pfa: "OAK Pensions Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null }
  },
  {
    pfa: "Pensions Alliance Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null }
  },
  {
    pfa: "CardinalStone Pensions Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null }
  },
  {
    pfa: "Veritas Glanvills Pensions Limited",
    funds: { "Fund I": null, "Fund II": null, "Fund III": null, "Fund IV": null }
  }
];
