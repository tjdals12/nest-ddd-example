export type DepartmentProperty = Pick<
    Department,
    'departmentNo' | 'departmentName'
>;

export class Department {
    private _departmentNo: string;
    get departmentNo() {
        return this._departmentNo;
    }
    private _departmentName: string;
    get departmentName() {
        return this._departmentName;
    }
    constructor(args: DepartmentProperty) {
        const { departmentNo, departmentName } = args;
        if (this.validateDepartmentNo(departmentNo) === false)
            throw new Error('Invalid departmentNo');
        if (this.validateDepartmentName(departmentName) === false)
            throw new Error('Invalid departmentName');
        this._departmentNo = departmentNo;
        this._departmentName = departmentName;
    }
    private validateDepartmentNo(departmentNo: string) {
        if (departmentNo === null || departmentNo === undefined) return false;
        const regex = /^(?=.*[a-z])[a-z0-9]{4,4}$/g;
        return regex.test(departmentNo);
    }
    private validateDepartmentName(departmentName: string) {
        if (departmentName === null || departmentName === undefined)
            return false;
        const regex = /^(?=.*[a-zA-Z0-9가-힣\-\s])[a-zA-Z0-9가-힣\-\s]{2,50}$/;
        return regex.test(departmentName);
    }
    update(args: { departmentName?: string }) {
        const { departmentName } = args;
        if (departmentName !== undefined) {
            if (this.validateDepartmentName(departmentName) === false)
                throw new Error('Invalid departmentName');
            this._departmentName = departmentName;
        }
    }
}
