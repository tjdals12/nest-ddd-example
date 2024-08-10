export type PaginationOption = {
    page: number;
    limit: number;
};

export type OrderOption<T> = {
    [K in keyof T]?: 'ASC' | 'DESC';
};
