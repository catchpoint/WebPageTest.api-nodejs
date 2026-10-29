import type { ApiResponse, ResponseData } from './response.js';

export type InstantTestScreenshot = {
  image: string;
  format?: string | null | undefined;
};

export type InstantTestScreenshotData = ResponseData & {
  screenshot?: InstantTestScreenshot | null | undefined;
};

export type InstantTestScreenshotResponse = ApiResponse<InstantTestScreenshotData>;
