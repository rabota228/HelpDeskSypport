import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { ChatArea } from "@/components/ChatArea";

export default function Dashboard() {
  const [match, params] = useRoute("/chat/:id");
  const chatId = match && params?.id ? parseInt(params.id, 10) : undefined;

  return (
    <Layout>
      <ChatArea chatId={chatId} />
    </Layout>
  );
}
