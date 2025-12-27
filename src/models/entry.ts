export interface EntryShape {
  path: string;
  color: string;
  textX: number;
  textY: number;
  textAngle: number;
}

export class Entry {
  shape?: EntryShape;

  constructor(public name: string) {}
}
