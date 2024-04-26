// Type definitions for Web NFC
// Project: https://github.com/w3c/web-nfc
// Definitions by: Takefumi Yoshii <https://github.com/takefumi-yoshii>
// TypeScript Version: 3.9

export {}

declare global {
  interface Window {
    NDEFMessage: typeof NDEFMessage;
    NDEFRecord: typeof NDEFRecord;
    NDEFReader: typeof NDEFReader;
    NDEFReadingEvent: typeof NDEFReadingEvent;
  }

  class NDEFMessage {
    constructor(messageInit: NDEFMessageInit);
    records: ReadonlyArray<NDEFRecord>;
  }

  interface NDEFMessageInit {
    records: NDEFRecordInit[];
  }

  type NDEFRecordDataSource = string | BufferSource | NDEFMessageInit;

  class NDEFRecord {
    constructor(recordInit: NDEFRecordInit);
    readonly recordType: string;
    readonly mediaType?: string;
    readonly id?: string;
    readonly data?: DataView;
    readonly encoding?: string;
    readonly lang?: string;
    toRecords?: () => NDEFRecord[];
  }

  interface NDEFRecordInit {
    recordType: string;
    mediaType?: string;
    id?: string;
    encoding?: string;
    lang?: string;
    data?: NDEFRecordDataSource;
  }

  type NDEFMessageSource = string | BufferSource | NDEFMessageInit;

  class NDEFReader extends EventTarget {
    constructor();
    onreading: (this: this, event: NDEFReadingEvent) => any;
    onreadingerror: (this: this, error: Event) => any;
    scan: (options?: NDEFScanOptions) => Promise<void>;
    write: (message: NDEFMessageSource, options?: NDEFWriteOptions) => Promise<void>;
  }

  class NDEFReadingEvent extends Event {
    constructor(type: string, readingEventInitDict: NDEFReadingEventInit);
    serialNumber: string;
    message: NDEFMessage;
  }

  interface NDEFReadingEventInit extends EventInit {
    serialNumber?: string;
    message: NDEFMessageInit;
  }

  interface NDEFWriteOptions {
    overwrite?: boolean;
    signal?: AbortSignal;
  }

  interface NDEFScanOptions {
    signal?: AbortSignal;
  }
}
