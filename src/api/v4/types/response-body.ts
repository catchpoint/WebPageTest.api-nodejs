export type ResponseBodyQuery = {
  run?: number | undefined;
  cached?: boolean | undefined;
  step?: number | undefined;
};

export type ResponseBodyDownload = {
  data: Uint8Array;
  contentType: string | null;
};
