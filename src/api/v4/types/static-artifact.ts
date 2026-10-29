export type StaticArtifactQuery = {
  run?: number | undefined;
  cached?: boolean | undefined;
  step?: number | undefined;
};

export type StaticArtifactDownload = {
  data: Uint8Array;
  contentType: string | null;
};
