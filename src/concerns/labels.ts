import type { Label } from "../types";
import type { KanClient } from "../client";

export interface CreateLabelInput {
  name: string;
  boardPublicId: string;
  colourCode: string;
}

export interface UpdateLabelInput {
  name: string;
  colourCode: string;
}

export class LabelsConcern {
  constructor(private client: KanClient) {}

  /**
   * Creates a new label.
   * @param input - The label creation input
   */
  async create(input: CreateLabelInput): Promise<Label> {
    return this.client.post<Label>("/labels", input);
  }

  /**
   * Retrieves a label by its public ID.
   * @param labelPublicId - The public ID of the label
   */
  async get(labelPublicId: string): Promise<Label> {
    return this.client.get<Label>(`/labels/${labelPublicId}`);
  }

  /**
   * Updates an existing label.
   * @param labelPublicId - The public ID of the label to update
   * @param input - The fields to update
   */
  async update(labelPublicId: string, input: UpdateLabelInput): Promise<Label> {
    return this.client.put<Label>(`/labels/${labelPublicId}`, input);
  }

  /**
   * Deletes a label.
   * @param labelPublicId - The public ID of the label to delete
   */
  async delete(labelPublicId: string): Promise<void> {
    await this.client.delete<void>(`/labels/${labelPublicId}`);
  }
}
