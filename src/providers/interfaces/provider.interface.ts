export interface IProvider<T> {
  execute(payload: T): Promise<void>;
  validateConfig: (payload: T) => Promise<boolean>;
}
