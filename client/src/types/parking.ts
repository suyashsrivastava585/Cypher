// src/types/parking.ts
export type SpotStatus = "occupied" | "available" | "reserved";

export interface Spot {
  block: string;
  number: number;
  status: SpotStatus;
}
