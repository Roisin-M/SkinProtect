import getReapplicationRecommendation from "@/services/getReapplicationRecommendation";

describe('getReapplicationRecommendation', () => {
  // Skin type "Type I (Very Fair)" adds 3, UV index 2 (<3) adds 0,
  // SPF factor 15 (<=15) adds 3, "Mostly Inside" adds 0.
  // Total score = 3 + 0 + 3 + 0 = 6 → since 6 > 5 and ≤8, should return 3.
  it('returns 3 for moderate score conditions with low UV (score=6)', () => {
    const result = getReapplicationRecommendation(
      "Type I (Very Fair)",
      2,
      15,
      "Mostly Inside",
      "Not Exposed"
    );
    expect(result).toBe(3);
  });
  // Skin type "Type V (Brown)" adds 1, UV index 2 (<3) adds 0,
  // SPF factor 40 (>30) adds 1, "Mostly Outside" with "Exposed" adds 3.
  // Total score = 1 + 0 + 1 + 3 = 5 → since 5 is >2 and ≤5, should return 2.
  it('returns 2 for moderate score conditions with mostly outside exposed (score=5)', () => {
    const result = getReapplicationRecommendation(
      "Type V (Brown)",
      2,
      40,
      "Mostly Outside",
      "Exposed"
    );
    expect(result).toBe(2);
  });
  // When UV index is 6 (or any value ≥6), the function should return 4 regardless.
  it('always returns 4 when UV index is 6 or above', () => {
    const result = getReapplicationRecommendation(
      "Type I (Very Fair)",
      6,
      15,
      "Mostly Inside",
      "Not Exposed"
    );
    expect(result).toBe(4);
  });
  // Unknown skin type defaults to a score increment of 0.
  // UV index 0 (<3) adds 0; SPF factor 50 (>30) adds 1; "Mostly Inside" adds 0.
  // Total score = 0 + 0 + 1 + 0 = 1 → since 1 ≤ 2, should return 1.
  it('returns 1 when conditions yield a very low score', () => {
    const result = getReapplicationRecommendation(
      "Unknown",  // unrecognized skin type; defaults to 0
      0,
      50,
      "Mostly Inside",
      "Not Exposed"
    );
    expect(result).toBe(1);
  });
  // Using "Both" activity and "Not Exposed":
  // Skin type "Type III (Medium)" adds 2, UV index 2 (<3) adds 0,
  // SPF factor 20 ( >15 and ≤30 ) adds 2, "Both" with "Not Exposed" adds 1.
  // Total = 2 + 0 + 2 + 1 = 5 → returns 2.
  it('returns 2 for "Both" activity with not exposed conditions (score=5)', () => {
    const result = getReapplicationRecommendation(
      "Type III (Medium)",
      2,
      20,
      "Both",
      "Not Exposed"
    );
    expect(result).toBe(2);
  });
  // Using "Both" activity with "Exposed":
  // Skin type "Type III (Medium)" adds 2, UV index 2 (<3) adds 0,
  // SPF factor 20 adds 2, "Both" with "Exposed" adds 3.
  // Total = 2 + 0 + 2 + 3 = 7 → returns 3.
  it('returns 3 for "Both" activity with exposed conditions (score=7)', () => {
    const result = getReapplicationRecommendation(
      "Type III (Medium)",
      2,
      20,
      "Both",
      "Exposed"
    );
    expect(result).toBe(3);
  });
});
