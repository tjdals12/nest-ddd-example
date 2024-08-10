import * as moment from 'moment';
import { DepartmentEmployee } from './department-employee-domain.entity';

describe('DepartmentEmployeeEntity', () => {
    const departmentNo = 'd001';
    const departmentName = 'Backend Development';
    const fromDate = new Date('2018-01-23');
    const toDate = new Date('9999-12-31');

    describe('Instantiate', () => {
        it('시작일은 1900-01-01 ~ 9999-12-31의 범위만 사용할 수 있다.', () => {
            const wrongFromDate1 = null;
            const wrongFromDate2 = new Date('1899-01-01');
            const wrongFromDate3 = new Date('10000-12-31');
            expect(
                () =>
                    new DepartmentEmployee({
                        type: 'create',
                        departmentNo,
                        departmentName,
                        fromDate: wrongFromDate1,
                        toDate,
                    }),
            ).toThrow();
            expect(
                () =>
                    new DepartmentEmployee({
                        type: 'create',
                        departmentNo,
                        departmentName,
                        fromDate: wrongFromDate2,
                        toDate,
                    }),
            ).toThrow();
            expect(
                () =>
                    new DepartmentEmployee({
                        type: 'create',
                        departmentNo,
                        departmentName,
                        fromDate: wrongFromDate3,
                        toDate,
                    }),
            ).toThrow();
        });
        it('종료일은 1900-01-01 ~ 9999-12-31의 범위만 사용할 수 있다.', () => {
            const wrongToDate1 = null;
            const wrongToDate2 = new Date('1899-01-01');
            const wrongToDate3 = new Date('10000-12-31');
            expect(
                () =>
                    new DepartmentEmployee({
                        type: 'create',
                        departmentNo,
                        departmentName,
                        fromDate,
                        toDate: wrongToDate1,
                    }),
            ).toThrow();
            expect(
                () =>
                    new DepartmentEmployee({
                        type: 'create',
                        departmentNo,
                        departmentName,
                        fromDate,
                        toDate: wrongToDate2,
                    }),
            ).toThrow();
            expect(
                () =>
                    new DepartmentEmployee({
                        type: 'create',
                        departmentNo,
                        departmentName,
                        fromDate,
                        toDate: wrongToDate3,
                    }),
            ).toThrow();
        });
        it('시작일은 종료일 보다 이전이어야 한다.', () => {
            const wrongFromDate = moment(toDate).add(1, 'day').toDate();
            const wrongToDate = moment(fromDate).subtract(1, 'day').toDate();
            expect(
                () =>
                    new DepartmentEmployee({
                        type: 'create',
                        departmentNo,
                        departmentName,
                        fromDate: wrongFromDate,
                        toDate,
                    }),
            ).toThrow();
            expect(
                () =>
                    new DepartmentEmployee({
                        type: 'create',
                        departmentNo,
                        departmentName,
                        fromDate,
                        toDate: wrongToDate,
                    }),
            ).toThrow();
        });
    });
});
