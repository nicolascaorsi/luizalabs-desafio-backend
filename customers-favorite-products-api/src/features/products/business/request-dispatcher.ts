export type DispatcherResponse<T> =
  | {
      success: T;
      error?: undefined;
    }
  | {
      success?: false;
      error: Error;
    };
export abstract class HttpRequestDispatcher {
  abstract get<T>(url: string): Promise<DispatcherResponse<T>>;
}
