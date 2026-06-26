const { z } = require("zod");

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system", "data", "function", "tool"]),
      content: z.string().optional(),
      parts: z.array(z.any()).optional(),
      id: z.string().optional(),
      createdAt: z.any().optional(),
    })
  ).min(1, "At least one message is required"),
});

const payloads = [
  {
    name: "Standard with parts",
    data: {
      messages: [
        { id: "1", role: "assistant", parts: [{ type: "text", text: "Hi" }] },
        { id: "2", role: "user", content: "How do I request brand access?" }
      ]
    }
  },
  {
    name: "Empty content",
    data: {
      messages: [
        { id: "1", role: "user", content: "" }
      ]
    }
  },
  {
    name: "Invalid role",
    data: {
      messages: [
        { id: "1", role: "hacker", content: "hello" }
      ]
    }
  }
];

for (const p of payloads) {
  const result = ChatRequestSchema.safeParse(p.data);
  console.log(`Test: ${p.name} - Success: ${result.success}`);
  if (!result.success) {
    console.log(result.error.issues[0].message);
  }
}
