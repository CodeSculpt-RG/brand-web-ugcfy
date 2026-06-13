const { z } = require("zod");

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1, "Message content cannot be empty"),
    })
  ).min(1, "At least one message is required"),
});

const req = {
  "messages": [
    {
      "id": "SIYAA-onboarding-start",
      "role": "assistant",
      "parts": [
        { "type": "text", "text": "Hi! I'm SIYAA..." }
      ]
    },
    {
      "id": "123",
      "role": "user",
      "content": "How do I request brand access?"
    }
  ]
};

const res = ChatRequestSchema.safeParse(req);
console.log(JSON.stringify(res, null, 2));
