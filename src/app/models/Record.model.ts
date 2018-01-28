export class RecordId {
  _id: string;
  key: string;
  value: string;
  createdAt: Date;
}

export class Record {
  _id: RecordId;
  totalCount: number;
}
