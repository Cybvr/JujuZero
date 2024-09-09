interface EmbeddedChatbotConfig {
  chatbotId: string;
  domain: string;
}

interface Window {
  embeddedChatbotConfig?: EmbeddedChatbotConfig;
}