import type { GrvtEnv } from "./config";

export type SafetyDecision = {
  allowed: boolean;
  reason: string;
};

export function assertWriteAllowed(options: {
  env: GrvtEnv;
  execute: boolean;
  operation: string;
}): SafetyDecision {
  if (options.env === "prod") {
    return {
      allowed: false,
      reason: `${options.operation} is blocked in prod by this sample app.`,
    };
  }
  if (!options.execute) {
    return {
      allowed: false,
      reason: `${options.operation} is dry-run only. Re-run with --execute --env testnet to send it.`,
    };
  }
  return {
    allowed: true,
    reason: `${options.operation} is allowed for ${options.env}.`,
  };
}
