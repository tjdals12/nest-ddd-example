export interface AvailableQuery<T> {
    equals(value: T): void;
    notEquals(value: T): void;
    in(values: T[]): void;
    greaterThan(value: T): void;
    greaterThanOrEquals(value: T): void;
    lessThan(value: T): void;
    lessThanOrEquals(value: T): void;
    between(min: T, max: T): void;
}

export type AvailableQueryType = keyof AvailableQuery<any>;

export interface QueryState<T, K> {
    type: K;
    value: T;
    values: T[];
}

export type IPropertyQuery<T, K extends AvailableQueryType> = Pick<
    AvailableQuery<T>,
    K
> &
    QueryState<T, K>;

export class PropertyQuery
    implements AvailableQuery<any>, QueryState<any, any>
{
    private _type: any;
    get type() {
        return this._type;
    }
    private _value: any;
    get value() {
        return this._value;
    }
    private _values: any[];
    get values() {
        return this._values;
    }
    equals(value: any): void {
        this._type = 'equals';
        this._value = value;
    }
    notEquals(value: any): void {
        this._type = 'notEquals';
        this._value = value;
    }
    in(values: any[]): void {
        this._type = 'in';
        this._values = values;
    }
    greaterThan(value: any): void {
        this._type = 'greaterThan';
        this._value = value;
    }
    greaterThanOrEquals(value: any): void {
        this._type = 'greaterThanOrEquals';
        this._value = value;
    }
    lessThan(value: any): void {
        this._type = 'lessThan';
        this._value = value;
    }
    lessThanOrEquals(value: any): void {
        this._type = 'lessThanOrEquals';
        this._value = value;
    }
    between(min: any, max: any): void {
        this._type = 'between';
        this._values = [min, max];
    }
}

export type QueryCondition<T, K extends keyof T> = Partial<
    Record<keyof Pick<T, K>, any>
>;
