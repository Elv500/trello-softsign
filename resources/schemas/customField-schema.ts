export const customFieldSchema = {
  type: "object",
  required: ["id", "idModel", "name", "type"],
  properties: {
    id: { type: "string" },
    idModel: { type: "string" },
    modelType: { type: "string" },
    name: { type: "string" },
    type: { type: "string" },
    options: {
      type: ["array", "null"]
    }
  },
  additionalProperties: true
};