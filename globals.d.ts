
declare global {
    type SingleOrArray<T> = T | T[];
    type IDString = Lowercase<string>;
    type NameString = Capitalize<string>;
}



export {};