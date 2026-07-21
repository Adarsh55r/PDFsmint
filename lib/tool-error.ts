export type ToolErrorCode =
  | "INVALID_FILE"
  | "PASSWORD_PROTECTED"
  | "TOO_MANY_PAGES"
  | "TOO_MANY_FILES"
  | "EMPTY_INPUT"
  | "NO_TEXT_FOUND"
  | "MEMORY_LIMIT"
  | "PROCESSING_FAILED";

export class ToolError extends Error {
  readonly code: ToolErrorCode;

  constructor(code: ToolErrorCode, message: string) {
    super(message);
    this.name = "ToolError";
    this.code = code;
  }
}

/** Map an unknown thrown value to a friendly, user-safe message. */
export function toFriendlyMessage(
  error: unknown,
  fallback = "Something went wrong. Please try a different file and try again.",
): string {
  if (error instanceof ToolError) return error.message;

  const raw = error instanceof Error ? error.message.toLowerCase() : String(error);

  if (
    raw.includes("password") ||
    raw.includes("encrypted") ||
    raw.includes("need a password")
  ) {
    return "This PDF is password-protected. Remove the password and try again.";
  }
  if (
    raw.includes("invalid pdf") ||
    raw.includes("corrupt") ||
    raw.includes("format error") ||
    raw.includes("missing pdf")
  ) {
    return "This file appears to be invalid or damaged. Try a different file.";
  }
  if (
    raw.includes("memory") ||
    raw.includes("allocation") ||
    raw.includes("out of memory")
  ) {
    return "This file is too large for your browser to process. Try a smaller file or close other tabs.";
  }

  return fallback;
}
