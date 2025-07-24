export type SimCard = {
  id: string;
  internalName: string;
  phoneNumber: string;
  status: "active" | "blocked" | "warming up";
  tags: string[];
  messageCount: number;
  createdAt: Date;
};

export type HistoryEntry = {
  id: string;
  simId: string;
  simName: string;
  type: "warm-up" | "broadcast";
  date: Date;
  details: string;
  tags: string[];
};
