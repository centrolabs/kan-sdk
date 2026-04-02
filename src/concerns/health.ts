import type { HealthStatus } from "../types";
import type { KanClient } from "../client";

export class HealthConcern {
  constructor(private client: KanClient) {}

  /**
   * Returns the health status of the application and its dependencies.
   */
  async check(): Promise<HealthStatus> {
    return this.client.get<HealthStatus>("/health");
  }
}
