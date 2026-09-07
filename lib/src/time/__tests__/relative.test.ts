import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDaysUntil, getDaysUntil, timeAgo } from "../relative.js";

describe("timeAgo", () => {
  const now = new Date("2026-08-31T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // === happy paths (en) ===

  it("returns 'now' for under a minute", () => {
    expect(timeAgo(new Date(now.getTime() - 30 * 1000), "en")).toBe("now");
  });

  it("returns 'now' for 0 seconds", () => {
    expect(timeAgo(now, "en")).toBe("now");
  });

  it("returns minutes for under an hour", () => {
    expect(timeAgo(new Date(now.getTime() - 5 * 60 * 1000), "en")).toBe(
      "5 minutes ago",
    );
  });

  it("returns hours for under a day", () => {
    expect(timeAgo(new Date(now.getTime() - 3 * 60 * 60 * 1000), "en")).toBe(
      "3 hours ago",
    );
  });

  it("returns 'yesterday' for exactly one day", () => {
    expect(timeAgo(new Date(now.getTime() - 24 * 60 * 60 * 1000), "en")).toBe(
      "yesterday",
    );
  });

  it("returns days for multiple days", () => {
    expect(
      timeAgo(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), "en"),
    ).toBe("5 days ago");
  });

  // === input variants ===

  it("accepts a numeric timestamp", () => {
    expect(timeAgo(now.getTime() - 5 * 60 * 1000, "en")).toBe("5 minutes ago");
  });

  it("accepts an ISO string", () => {
    expect(
      timeAgo(new Date(now.getTime() - 5 * 60 * 1000).toISOString(), "en"),
    ).toBe("5 minutes ago");
  });

  // === boundaries ===

  it("rolls over from seconds to minutes at 60s", () => {
    expect(timeAgo(new Date(now.getTime() - 60 * 1000), "en")).toBe(
      "1 minute ago",
    );
  });

  it("rolls over from minutes to hours at 60min", () => {
    expect(timeAgo(new Date(now.getTime() - 60 * 60 * 1000), "en")).toBe(
      "1 hour ago",
    );
  });

  // === sad paths ===

  it("treats future dates as 'now'", () => {
    expect(timeAgo(new Date(now.getTime() + 60 * 1000), "en")).toBe("now");
  });

  // === locales ===

  it("formats in Norwegian", () => {
    expect(timeAgo(new Date(now.getTime() - 5 * 60 * 1000), "no")).toBe(
      "for 5 minutter siden",
    );
  });

  it("formats in French", () => {
    expect(timeAgo(new Date(now.getTime() - 3 * 60 * 60 * 1000), "fr")).toBe(
      "il y a 3 heures",
    );
  });

  it("falls back to the runtime default locale when omitted", () => {
    expect(timeAgo(new Date(now.getTime() - 5 * 60 * 1000))).toBe(
      "5 minutes ago",
    );
  });
});

describe("getDaysUntil", () => {
  const now = new Date("2026-08-31T12:00:00.000Z");
  const day = 24 * 60 * 60 * 1000;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // === happy paths ===

  it("returns a positive count for a future date", () => {
    expect(getDaysUntil(new Date(now.getTime() + 3 * day).toISOString())).toBe(
      3,
    );
  });

  it("returns a negative count for a past date", () => {
    expect(getDaysUntil(new Date(now.getTime() - 3 * day).toISOString())).toBe(
      -3,
    );
  });

  it("returns 0 for the current instant", () => {
    expect(getDaysUntil(now.toISOString())).toBe(0);
  });

  // === boundaries ===

  it("rounds a partial day up towards the future", () => {
    expect(
      getDaysUntil(new Date(now.getTime() + 1 * day + 1000).toISOString()),
    ).toBe(2);
  });

  it("rounds a partial day up towards zero from the past", () => {
    expect(getDaysUntil(new Date(now.getTime() - 1000).toISOString())).toBe(-0);
  });
});

describe("formatDaysUntil", () => {
  const now = new Date("2026-08-31T12:00:00.000Z");
  const day = 24 * 60 * 60 * 1000;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // === happy paths (en) ===

  it("formats a future date", () => {
    expect(
      formatDaysUntil(new Date(now.getTime() + 3 * day).toISOString(), "en"),
    ).toBe("in 3 days");
  });

  it("formats 'tomorrow' for a date one day out", () => {
    expect(
      formatDaysUntil(new Date(now.getTime() + 1 * day).toISOString(), "en"),
    ).toBe("tomorrow");
  });

  it("formats a past date", () => {
    expect(
      formatDaysUntil(new Date(now.getTime() - 3 * day).toISOString(), "en"),
    ).toBe("3 days ago");
  });

  it("formats 'today' for the current instant", () => {
    expect(formatDaysUntil(now.toISOString(), "en")).toBe("today");
  });

  // === locales ===

  it("formats in Norwegian", () => {
    expect(
      formatDaysUntil(new Date(now.getTime() + 3 * day).toISOString(), "no"),
    ).toBe("om 3 døgn");
  });
});
