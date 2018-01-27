export class RecordId {
  _id: string;
  key: string;
  value: string;
  createdAt: Date;
}

export class Record {
  id: RecordId;
  totalCount: number;
}
