import * as moment from 'moment';
import { EmployeeSalary } from './employee-salary-domain.entity';
import { Employee } from './employee-domain.entity';

describe('EmployeeSalaryEntity', () => {
    const employeeNo = 1000;
    const salary = 10000;
    const fromDate = new Date('2023-01-02');
    const toDate = new Date('9999-12-31');
    const employee = new Employee({ firstName: 'Harry', lastName: 'Rodwell' });

    describe('Instantiate', () => {
        it('시작일은 1900-01-01 ~ 9999-12-31의 범위만 사용할 수 있다.', () => {
            const wrongFromDate1 = null;
            const wrongFromDate2 = new Date('1899-01-01');
            const wrongFromDate3 = new Date('10000-12-31');
            expect(
                () =>
                    new EmployeeSalary({
                        type: 'create',
                        employeeNo,
                        salary,
                        fromDate: wrongFromDate1,
                        toDate,
                        employee,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeSalary({
                        type: 'create',
                        employeeNo,
                        salary,
                        fromDate: wrongFromDate2,
                        toDate,
                        employee,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeSalary({
                        type: 'create',
                        employeeNo,
                        salary,
                        fromDate: wrongFromDate3,
                        toDate,
                        employee,
                    }),
            ).toThrow();
        });
        it('종료일은 1900-01-01 ~ 9999-12-31의 범위만 사용할 수 있다.', () => {
            const wrongToDate1 = null;
            const wrongToDate2 = new Date('1899-01-01');
            const wrongToDate3 = new Date('10000-12-31');
            expect(
                () =>
                    new EmployeeSalary({
                        type: 'create',
                        employeeNo,
                        salary,
                        fromDate,
                        toDate: wrongToDate1,
                        employee,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeSalary({
                        type: 'create',
                        employeeNo,
                        salary,
                        fromDate,
                        toDate: wrongToDate2,
                        employee,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeSalary({
                        type: 'create',
                        employeeNo,
                        salary,
                        fromDate,
                        toDate: wrongToDate3,
                        employee,
                    }),
            ).toThrow();
        });
        it('시작일은 종료일 보다 이전이어야 한다.', () => {
            const wrongFromDate = moment(toDate).add(1, 'day').toDate();
            const wrongToDate = moment(fromDate).subtract(1, 'day').toDate();
            expect(
                () =>
                    new EmployeeSalary({
                        type: 'create',
                        employeeNo,
                        salary,
                        fromDate: wrongFromDate,
                        toDate,
                        employee,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeSalary({
                        type: 'create',
                        employeeNo,
                        salary,
                        fromDate,
                        toDate: wrongToDate,
                        employee,
                    }),
            ).toThrow();
        });
    });
});
