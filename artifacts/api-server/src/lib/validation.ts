import xss from "xss";
import { z } from "zod/v4";

// Sanitize user input
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  // Remove potentially dangerous characters but allow reasonable text
  return xss(input, {
    whiteList: {},
    stripIgnoredTag: true,
  }).trim();
}

// Validate and sanitize conversation title
export function validateTitle(title: string): string {
  const sanitized = sanitizeInput(title);
  
  if (sanitized.length < 1) {
    throw new Error("Title cannot be empty");
  }
  if (sanitized.length > 200) {
    throw new Error("Title must be less than 200 characters");
  }
  
  return sanitized;
}

// Validate and sanitize message content
export function validateMessage(content: string): string {
  const sanitized = sanitizeInput(content);
  
  if (sanitized.length < 1) {
    throw new Error("Message cannot be empty");
  }
  if (sanitized.length > 5000) {
    throw new Error("Message must be less than 5000 characters");
  }
  
  return sanitized;
}

// Validate conversation ID
export function validateConversationId(id: any): number {
  const parsed = parseInt(id, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    throw new Error("Invalid conversation ID");
  }
  return parsed;
}

// Detect potential prompt injection
export function detectPromptInjection(text: string): boolean {
  const injectionPatterns = [
    /ignore\s+previous/i,
    /forget\s+instructions/i,
    /system\s+prompt/i,
    /jailbreak/i,
    /bypass\s+security/i,
    /ignore\s+rules/i,
  ];
  
  return injectionPatterns.some(pattern => pattern.test(text));
}
