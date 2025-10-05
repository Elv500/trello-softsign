export const input_create_checklist = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    idCard: { type: "string", minLength: 1 }
  },
  required: ["name", "idCard"],
  additionalProperties: false
} as const;
