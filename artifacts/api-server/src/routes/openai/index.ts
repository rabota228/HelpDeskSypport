import { Router, type IRouter } from "express";
import { db, conversations, messages } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  CreateOpenaiConversationBody,
  SendOpenaiMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are HelpDesk Pro AI, an expert IT Help Desk Support Specialist with deep knowledge across all three support levels.

You specialize in:

**Level 1 (L1) Support:**
- Password resets and account unlocks (Active Directory, Azure AD, Office 365)
- Basic connectivity troubleshooting (Wi-Fi, VPN, internet)
- Printer and peripheral issues
- Common software errors (Office, browsers, email clients)
- Hardware basics (laptop, desktop, monitors)
- Basic ticket creation and user communication
- First-call resolution best practices

**Level 2 (L2) Support:**
- Network diagnostics (ping, traceroute, DNS, DHCP)
- OS-level issues (Windows, macOS, Linux)
- Software installation and licensing
- Active Directory / LDAP management
- VPN configuration and troubleshooting
- Remote Desktop (RDP, TeamViewer, AnyDesk)
- Microsoft 365 admin and Exchange
- Escalation handling and documentation
- SCCM / Intune device management

**Level 3 (L3) Support:**
- Server administration (Windows Server, Linux servers)
- Infrastructure management (VMware, Hyper-V, Azure, AWS)
- Complex network issues (routing, switching, firewall)
- Root Cause Analysis (RCA) methodology
- Security incident response
- Vendor escalations and management
- SLA management and reporting
- PowerShell / scripting automation
- ITSM platform administration (ServiceNow, Jira, Zendesk)

**ITIL Best Practices:**
- Incident, Problem, Change, and Request management
- Knowledge Base article creation
- Ticket categorization and prioritization
- Communication templates for users and stakeholders
- Escalation paths and procedures
- SLA adherence and reporting

**Communication & Documentation:**
- Professional email/ticket templates
- Step-by-step troubleshooting guides
- Knowledge Base articles (how-to format)
- Escalation summaries
- Post-incident reports

Always provide practical, actionable advice. Format responses clearly with numbered steps when giving instructions. Include relevant commands, scripts, or templates when appropriate. Ask clarifying questions when you need more information to provide accurate support.`;

router.get("/conversations", async (_req, res) => {
  const convs = await db
    .select()
    .from(conversations)
    .orderBy(asc(conversations.createdAt));
  res.json(
    convs.map((c) => ({
      id: c.id,
      title: c.title,
      createdAt: c.createdAt.toISOString(),
    }))
  );
});

router.post("/conversations", async (req, res) => {
  const body = CreateOpenaiConversationBody.parse(req.body);
  const [conv] = await db
    .insert(conversations)
    .values({ title: body.title })
    .returning();
  res.status(201).json({
    id: conv.id,
    title: conv.title,
    createdAt: conv.createdAt.toISOString(),
  });
});

router.get("/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));
  res.json({
    id: conv.id,
    title: conv.title,
    createdAt: conv.createdAt.toISOString(),
    messages: msgs.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
  });
});

router.delete("/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  await db.delete(conversations).where(eq(conversations.id, id));
  res.status(204).send();
});

router.get("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id);
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));
  res.json(
    msgs.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    }))
  );
});

router.post("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id);
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  const body = SendOpenaiMessageBody.parse(req.body);

  await db.insert(messages).values({
    conversationId: id,
    role: "user",
    content: body.content,
  });

  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  const chatMessages = history.map((m) => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  const stream = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...chatMessages],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      fullResponse += content;
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  await db.insert(messages).values({
    conversationId: id,
    role: "assistant",
    content: fullResponse,
  });

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
