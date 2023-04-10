// export type OmitMethods<T> = { [K in keyof T]: T[K] extends Function ? never : T[K] };
// export default OmitMethods;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export default NonFunctionProperties