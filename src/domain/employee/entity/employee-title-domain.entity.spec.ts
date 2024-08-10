import * as moment from 'moment';
import { EmployeeTitle } from './employee-title-domain.entity';

describe('EmployeeTitleEntity', () => {
    const title = 'Engineer';
    const fromDate = new Date('2018-02-13');
    const toDate = new Date('9999-12-31');

    describe('Instantiate', () => {
        it('시작일은 1900-01-01 ~ 9999-12-31의 범위만 사용할 수 있다.', () => {
            const wrongFromDate1 = null;
            const wrongFromDate2 = new Date('1899-01-01');
            const wrongFromDate3 = new Date('9999-12-31');
            expect(
                () =>
                    new EmployeeTitle({
                        type: 'create',
                        title,
                        fromDate: wrongFromDate1,
                        toDate,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeTitle({
                        type: 'create',
                        title,
                        fromDate: wrongFromDate2,
                        toDate,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeTitle({
                        type: 'create',
                        title,
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
                    new EmployeeTitle({
                        type: 'create',
                        title,
                        fromDate,
                        toDate: wrongToDate1,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeTitle({
                        type: 'create',
                        title,
                        fromDate,
                        toDate: wrongToDate2,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeTitle({
                        type: 'create',
                        title,
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
                    new EmployeeTitle({
                        type: 'create',
                        title,
                        fromDate: wrongFromDate,
                        toDate,
                    }),
            ).toThrow();
            expect(
                () =>
                    new EmployeeTitle({
                        type: 'create',
                        title,
                        fromDate,
                        toDate: wrongToDate,
                    }),
            ).toThrow();
        });
    });
});
