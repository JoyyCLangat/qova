import { describe, expect, it } from "vitest";
import {
  getGrade,
  getScoreColor,
  formatScore,
  scoreToPercentage,
} from "../src/utils/score.js";
import {
  shortenAddress,
  isValidAddress,
  checksumAddress,
} from "../src/utils/address.js";
import {
  formatWei,
  formatTimestamp,
  formatBasisPoints,
} from "../src/utils/format.js";

describe("getGrade", () => {
  it("should return AAA for score >= 950", () => {
    expect(getGrade(950)).toBe("AAA");
    expect(getGrade(1000)).toBe("AAA");
  });

  it("should return AA for score 900-949", () => {
    expect(getGrade(900)).toBe("AA");
    expect(getGrade(949)).toBe("AA");
  });

  it("should return A for score 850-899", () => {
    expect(getGrade(850)).toBe("A");
    expect(getGrade(899)).toBe("A");
  });

  it("should return BBB for score 750-849", () => {
    expect(getGrade(750)).toBe("BBB");
    expect(getGrade(849)).toBe("BBB");
  });

  it("should return BB for score 650-749", () => {
    expect(getGrade(650)).toBe("BB");
    expect(getGrade(749)).toBe("BB");
  });

  it("should return B for score 550-649", () => {
    expect(getGrade(550)).toBe("B");
    expect(getGrade(649)).toBe("B");
  });

  it("should return CCC for score 450-549", () => {
    expect(getGrade(450)).toBe("CCC");
    expect(getGrade(549)).toBe("CCC");
  });

  it("should return CC for score 350-449", () => {
    expect(getGrade(350)).toBe("CC");
    expect(getGrade(449)).toBe("CC");
  });

  it("should return C for score 250-349", () => {
    expect(getGrade(250)).toBe("C");
    expect(getGrade(349)).toBe("C");
  });

  it("should return D for score 0-249", () => {
    expect(getGrade(0)).toBe("D");
    expect(getGrade(249)).toBe("D");
  });
});

describe("getScoreColor", () => {
  it("should return green for score >= 700", () => {
    expect(getScoreColor(700)).toBe("#22C55E");
    expect(getScoreColor(1000)).toBe("#22C55E");
  });

  it("should return yellow for score 400-699", () => {
    expect(getScoreColor(400)).toBe("#FACC15");
    expect(getScoreColor(699)).toBe("#FACC15");
  });

  it("should return red for score 0-399", () => {
    expect(getScoreColor(0)).toBe("#EF4444");
    expect(getScoreColor(399)).toBe("#EF4444");
  });
});

describe("formatScore", () => {
  it("should pad to 4 characters", () => {
    expect(formatScore(0)).toBe("0000");
    expect(formatScore(42)).toBe("0042");
    expect(formatScore(847)).toBe("0847");
    expect(formatScore(1000)).toBe("1000");
  });

  it("should clamp values to 0-1000", () => {
    expect(formatScore(-10)).toBe("0000");
    expect(formatScore(1500)).toBe("1000");
  });

  it("should round fractional scores", () => {
    expect(formatScore(847.6)).toBe("0848");
    expect(formatScore(847.4)).toBe("0847");
  });
});

describe("scoreToPercentage", () => {
  it("should convert score to percentage", () => {
    expect(scoreToPercentage(0)).toBe(0);
    expect(scoreToPercentage(500)).toBe(50);
    expect(scoreToPercentage(750)).toBe(75);
    expect(scoreToPercentage(1000)).toBe(100);
  });
});

describe("shortenAddress", () => {
  const addr = "0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158";

  it("should shorten with default 4 chars", () => {
    expect(shortenAddress(addr)).toBe("0x0a3A...1158");
  });

  it("should shorten with custom char count", () => {
    expect(shortenAddress(addr, 6)).toBe("0x0a3AF9...431158");
  });
});

describe("isValidAddress", () => {
  it("should return true for valid address", () => {
    expect(isValidAddress("0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158")).toBe(true);
  });

  it("should return false for invalid address", () => {
    expect(isValidAddress("not-an-address")).toBe(false);
    expect(isValidAddress("0x123")).toBe(false);
    expect(isValidAddress("")).toBe(false);
  });
});

describe("checksumAddress", () => {
  it("should return checksummed address", () => {
    const result = checksumAddress("0x0a3af9a104bd2b5d96c7e24fe95cc03432431158");
    expect(result).toBe("0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158");
  });
});

describe("formatWei", () => {
  it("should format 18-decimal ETH values", () => {
    expect(formatWei(1000000000000000000n)).toBe("1");
    expect(formatWei(1500000000000000000n)).toBe("1.5");
  });

  it("should format 6-decimal USDC values", () => {
    expect(formatWei(1000000n, 6)).toBe("1");
    expect(formatWei(1500000n, 6)).toBe("1.5");
  });

  it("should handle zero", () => {
    expect(formatWei(0n)).toBe("0");
  });
});

describe("formatTimestamp", () => {
  it("should convert block timestamp to Date", () => {
    const date = formatTimestamp(1709000000n);
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBeGreaterThanOrEqual(2024);
  });
});

describe("formatBasisPoints", () => {
  it("should format 10000 as 100.00%", () => {
    expect(formatBasisPoints(10000)).toBe("100.00%");
  });

  it("should format 9750 as 97.50%", () => {
    expect(formatBasisPoints(9750)).toBe("97.50%");
  });

  it("should format 0 as 0.00%", () => {
    expect(formatBasisPoints(0)).toBe("0.00%");
  });

  it("should format 5000 as 50.00%", () => {
    expect(formatBasisPoints(5000)).toBe("50.00%");
  });
});
