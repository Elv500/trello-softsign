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
    },
  },
  required: ["id", "name", "idBoard", "idCard"],
} as const;
