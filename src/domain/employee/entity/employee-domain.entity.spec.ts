import { EmployeeSalary } from './employee-salary-domain.entity';
import { Employee } from './employee-domain.entity';

describe('EmployeeEntity', () => {
    const employeeNo = 10000;
    const firstName = 'Georgi';
    const lastName = 'Facello';
    const gender = 'M';
    const birthDate = new Date('1999-01-23');
    const hireDate = new Date('2020-02-03');
    const departments = [];
    const titles = [];
    const latestSalary = new EmployeeSalary({
        salary: 1000,
        fromDate: new Date('1999-01-23'),
        toDate: new Date('9999-12-31'),
    });

    describe('Instantiate', () => {
        it('이름(firstName)은 영어와 한글만 사용할 수 있다.', () => {
            const wrongFirstName1 = 'Georgi12';
            const wrongFirstName2 = 'Georgi#';
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName: wrongFirstName1,
                        lastName,
                        gender,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName: wrongFirstName2,
                        lastName,
                        gender,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
        });
        it('이름(firstName)은 2글자 이상, 16글자 이하이어야 한다.', () => {
            const wrongFirstName1 = 'G';
            const wrongFirstName2 = 'G' + 'e'.repeat(16);
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName: wrongFirstName1,
                        lastName,
                        gender,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName: wrongFirstName2,
                        lastName,
                        gender,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
        });
        it('성(lastName)은 영어와 한글만 사용할 수 있다.', () => {
            const wrongLastName1 = 'Facello1';
            const wrongLastName2 = 'Facello#';
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName: wrongLastName1,
                        gender,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName: wrongLastName2,
                        gender,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
        });
        it('성(lastName)은 2글자 이상, 16글자 이하이어야 한다.', () => {
            const wrongLastName1 = 'G';
            const wrongLastName2 = 'G' + 'e'.repeat(16);
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName: wrongLastName1,
                        gender,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName: wrongLastName2,
                        gender,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
        });
        it('성별은 M 또는 F만 사용할 수 있다.', () => {
            const wrongGender1 = 'm';
            const wrongGender2 = 'f';
            const wrongGender3 = 'A';
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName,
                        gender: wrongGender1 as any,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName,
                        gender: wrongGender2 as any,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName,
                        gender: wrongGender3 as any,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
        });
        it('생일은 1900-01-01 ~ 현재 날짜의 범위만 사용할 수 있다.', () => {
            const wrongBirthDate1 = new Date('1899-01-01');
            const wrongBirthDate2 = new Date('2101-01-01');
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName,
                        gender,
                        birthDate: wrongBirthDate1,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName,
                        gender,
                        birthDate: wrongBirthDate2,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
        });
        it('입사일은 1900-01-01 ~ 현재 날짜의 범위만 사용할 수 있다.', () => {
            const wrongHireDate1 = new Date('1899-01-01');
            const wrongHireDate2 = new Date('2101-01-01');
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName,
                        gender,
                        birthDate,
                        hireDate: wrongHireDate1,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName,
                        gender,
                        birthDate,
                        hireDate: wrongHireDate2,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).toThrow();
        });
        it('값이 올바르다면 엔티티를 생성해야 한다.', () => {
            expect(
                () =>
                    new Employee({
                        type: 'create',
                        employeeNo,
                        firstName,
                        lastName,
                        gender,
                        birthDate,
                        hireDate,
                        departments,
                        titles,
                        latestSalary,
                    }),
            ).not.toThrow();
        });
    });

    describe('update', () => {
        it('잘못된 이름(firstName)을 입력할 경우 예외를 발생시킨다.', () => {
            const employee = new Employee({
                type: 'create',
                employeeNo,
                firstName,
                lastName,
                gender,
                birthDate,
                hireDate,
                departments,
                titles,
                latestSalary,
            });
            const wrongFirstName1 = 'Georgi12';
            const wrongFirstName2 = 'Georgi#';
            const wrongFirstName3 = 'G';
            const wrongFirstName4 = 'G' + 'e'.repeat(16);
            expect(() =>
                employee.update({ firstName: wrongFirstName1 }),
            ).toThrow();
            expect(() =>
                employee.update({ firstName: wrongFirstName2 }),
            ).toThrow();
            expect(() =>
                employee.update({ firstName: wrongFirstName3 }),
            ).toThrow();
            expect(() =>
                employee.update({ firstName: wrongFirstName4 }),
            ).toThrow();
        });
        it('잘못된 성(lastName)을 입력할 경우 예외를 발생시킨다.', () => {
            const employee = new Employee({
                type: 'create',
                employeeNo,
                firstName,
                lastName,
                gender,
                birthDate,
                hireDate,
                departments,
                titles,
                latestSalary,
            });
            const wrongLastName1 = 'Facello1';
            const wrongLastName2 = 'Facello#';
            const wrongLastName3 = 'G';
            const wrongLastName4 = 'G' + 'e'.repeat(16);
            expect(() =>
                employee.update({ lastName: wrongLastName1 }),
            ).toThrow();
            expect(() =>
                employee.update({ lastName: wrongLastName2 }),
            ).toThrow();
            expect(() =>
                employee.update({ lastName: wrongLastName3 }),
            ).toThrow();
            expect(() =>
                employee.update({ lastName: wrongLastName4 }),
            ).toThrow();
        });
        it('잘못된 성별을 입력할 경우 예외를 발생시킨다.', () => {
            const employee = new Employee({
                type: 'create',
                employeeNo,
                firstName,
                lastName,
                gender,
                birthDate,
                hireDate,
                departments,
                titles,
                latestSalary,
            });
            const wrongGender1 = 'm' as any;
            const wrongGender2 = 'f' as any;
            const wrongGender3 = 'A' as any;
            expect(() => employee.update({ gender: wrongGender1 })).toThrow();
            expect(() => employee.update({ gender: wrongGender2 })).toThrow();
            expect(() => employee.update({ gender: wrongGender3 })).toThrow();
        });
        it('잘못된 생일을 입력할 경우 예외를 발생시킨다.', () => {
            const employee = new Employee({
                type: 'create',
                employeeNo,
                firstName,
                lastName,
                gender,
                birthDate,
                hireDate,
                departments,
                titles,
                latestSalary,
            });
            const wrongBirthDate1 = new Date('1899-01-01');
            const wrongBirthDate2 = new Date('2101-01-01');
            expect(() =>
                employee.update({ birthDate: wrongBirthDate1 }),
            ).toThrow();
            expect(() =>
                employee.update({ birthDate: wrongBirthDate2 }),
            ).toThrow();
        });
        it('잘못된 입사일을 입력할 경우 예외를 발생시킨다.', () => {
            const employee = new Employee({
                type: 'create',
                employeeNo,
                firstName,
                lastName,
                gender,
                birthDate,
                hireDate,
                departments,
                titles,
                latestSalary,
            });
            const wrongHireDate1 = new Date('1899-01-01');
            const wrongHireDate2 = new Date('2101-01-01');
            expect(() =>
                employee.update({ hireDate: wrongHireDate1 }),
            ).toThrow();
            expect(() =>
                employee.update({ hireDate: wrongHireDate2 }),
            ).toThrow();
        });
        it('입력한 정보만 수정해야 한다.', () => {
            const employee = new Employee({
                type: 'create',
                employeeNo,
                firstName,
                lastName,
                gender,
                birthDate,
                hireDate,
                departments,
                titles,
                latestSalary,
            });
            const updatedFirstName = 'Bezalel';
            const updatedLastName = 'Simmel';
            const updatedGender = 'F';
            const updatedBirthDate = new Date('1995-06-08');
            const updatedHireDate = new Date('2016-10-26');

            employee.update({ firstName: updatedFirstName });
            expect(employee.firstName).toEqual(updatedFirstName);
            expect(employee.lastName).toEqual(lastName);
            expect(employee.gender).toEqual(gender);
            expect(employee.birthDate).toEqual(birthDate);
            expect(employee.hireDate).toEqual(hireDate);

            employee.update({ lastName: updatedLastName });
            expect(employee.firstName).toEqual(updatedFirstName);
            expect(employee.lastName).toEqual(updatedLastName);
            expect(employee.gender).toEqual(gender);
            expect(employee.birthDate).toEqual(birthDate);
            expect(employee.hireDate).toEqual(hireDate);

            employee.update({ gender: updatedGender });
            expect(employee.firstName).toEqual(updatedFirstName);
            expect(employee.lastName).toEqual(updatedLastName);
            expect(employee.gender).toEqual(updatedGender);
            expect(employee.birthDate).toEqual(birthDate);
            expect(employee.hireDate).toEqual(hireDate);

            employee.update({ birthDate: updatedBirthDate });
            expect(employee.firstName).toEqual(updatedFirstName);
            expect(employee.lastName).toEqual(updatedLastName);
            expect(employee.gender).toEqual(updatedGender);
            expect(employee.birthDate).toEqual(updatedBirthDate);
            expect(employee.hireDate).toEqual(hireDate);

            employee.update({ hireDate: updatedHireDate });
            expect(employee.firstName).toEqual(updatedFirstName);
            expect(employee.lastName).toEqual(updatedLastName);
            expect(employee.gender).toEqual(updatedGender);
            expect(employee.birthDate).toEqual(updatedBirthDate);
            expect(employee.hireDate).toEqual(updatedHireDate);
        });
    });
});
