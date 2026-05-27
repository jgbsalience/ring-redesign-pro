import { describe, it, expect } from "vitest";
import { ContactSchema } from "./contact";
import { AppraisalSchema } from "./appraisal";

describe("Honeypot behavior", () => {
  const validContact = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    enquiryType: "General",
    message: "Hello",
  };

  it("ContactSchema allows empty website", () => {
    const result = ContactSchema.safeParse({ ...validContact, website: "" });
    expect(result.success).toBe(true);
    expect(result.data?.website).toBe("");
  });

  it("ContactSchema allows missing website (defaults to empty)", () => {
    const result = ContactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
    expect(result.data?.website).toBe("");
  });

  it("ContactSchema allows non-empty website (to be caught by logic)", () => {
    const result = ContactSchema.safeParse({ ...validContact, website: "bot-fill" });
    expect(result.success).toBe(true);
    expect(result.data?.website).toBe("bot-fill");
  });

  const validAppraisal = {
    name: "John Doe",
    phone: "0412345678",
    email: "john@example.com",
    propertyType: "House",
    interests: [],
  };

  it("AppraisalSchema allows empty website", () => {
    const result = AppraisalSchema.safeParse({ ...validAppraisal, website: "" });
    expect(result.success).toBe(true);
    expect(result.data?.website).toBe("");
  });

  it("AppraisalSchema allows non-empty website", () => {
    const result = AppraisalSchema.safeParse({ ...validAppraisal, website: "bot-fill" });
    expect(result.success).toBe(true);
    expect(result.data?.website).toBe("bot-fill");
  });
});
