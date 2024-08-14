export type PaginationOption = {
    page: number;
    limit: number;
};

export const Order = {
    Ascending: 'ASC',
    Descending: 'DESC',
} as const;

export type OrderOption<T> = {
    [K in keyof T]?: (typeof Order)[keyof typeof Order];
};
