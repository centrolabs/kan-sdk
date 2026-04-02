import type { User } from "../types";
import type { KanClient } from "../client";

export interface UpdateUserInput {
  name?: string;
  image?: string;
}

export class UsersConcern {
  constructor(private client: KanClient) {}

  /**
   * Retrieves the currently authenticated user.
   */
  async me(): Promise<User> {
    return this.client.get<User>("/users/me");
  }

  /**
   * Updates the currently authenticated user.
   * @param input - The fields to update
   */
  async update(input: UpdateUserInput): Promise<User> {
    return this.client.put<User>("/users/me", input);
  }
}
