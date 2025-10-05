export const output_create_checklist = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    idBoard: { type: "string" },
    idCard: { type: "string" },
    pos: { type: "number" },
    checkItems: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          state: { type: "string" }
        },
        required: ["id", "name", "state"],
        additionalProperties: false
      }
    }
  },
  required: ["id", "name", "idBoard", "idCard", "pos", "checkItems"],
  additionalProperties: false
} as const;
