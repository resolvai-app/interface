/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * the options to initiate the client, ensure apiKey is required
 */
export type LiveClientOptions = { url: string };

/** log types */
export type StreamingLog = {
  date: Date;
  type: string;
  count?: number;
  message: string | ClientContentLog;
};

export type ClientContentLog = {
  turns: unknown[];
  turnComplete: boolean;
};

/**
 * Chat related types
 */
export type Chat = {
  id: string;
  title: string;
  describe: string;
  createdAt: string;
  state: {
    model: string;
    voice: string;
  };
};
