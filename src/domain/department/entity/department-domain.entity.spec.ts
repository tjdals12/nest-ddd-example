import { Department } from './department-domain.entity';

describe('DepartmentEntity', () => {
    const departmentNo = 'd001';
    const departmentName = 'Backend Development';

    describe('Instantiate', () => {
        it('부서번호(departmentNo)는 영어 소문자로 시작해야 한다.', () => {
            const wrongDepartmentNo = '1234';
            expect(
                () =>
                    new Department({
                        departmentNo: wrongDepartmentNo,
                        departmentName,
                    }),
            ).toThrow();
        });
        it('부서번호(departmentNo)는 영어 소문자와 숫자만 사용할 수 있다.', () => {
            const wrongDepartmentNo1 = '_d001';
            const wrongDepartmentNo2 = 'D001';
            expect(
                () =>
                    new Department({
                        departmentNo: wrongDepartmentNo1,
                        departmentName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Department({
                        departmentNo: wrongDepartmentNo2,
                        departmentName,
                    }),
            ).toThrow();
        });
        it('부서번호(departmentNo)는 4글자이어야 한다.', () => {
            const wrongDepartmentNo1 = 'd01';
            const wrongDepartmentNo2 = 'd' + '0'.repeat(4);
            expect(
                () =>
                    new Department({
                        departmentNo: wrongDepartmentNo1,
                        departmentName,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Department({
                        departmentNo: wrongDepartmentNo2,
                        departmentName,
                    }),
            ).toThrow();
        });
        it('부서명(departmentName)은 영문, 숫자, 한글, 하이픈(-), 공백만 사용할 수 있다.', () => {
            const wrongDepartmentName1 = 'Backend Development #1';
            const wrongDepartmentName2 = '백엔드 개발팀 #1';
            const rightDepartmentName1 = 'Backend Development - 1';
            const rightDepartmentName2 = '백엔드 개발팀 - 1';
            expect(
                () =>
                    new Department({
                        departmentNo,
                        departmentName: wrongDepartmentName1,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Department({
                        departmentNo,
                        departmentName: wrongDepartmentName2,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Department({
                        departmentNo,
                        departmentName: rightDepartmentName1,
                    }),
            ).not.toThrow();
            expect(
                () =>
                    new Department({
                        departmentNo,
                        departmentName: rightDepartmentName2,
                    }),
            ).not.toThrow();
        });
        it('부서명(departmentName)은 2글자 이상, 50글자 이하이어야 한다.', () => {
            const wrongDepartmentName1 = 'B';
            const wrongDepartmentName2 = '백';
            const wrongDepartmentName3 = 'B' + '_'.repeat(50);
            const wrongDepartmentName4 = '백' + '_'.repeat(50);
            expect(
                () =>
                    new Department({
                        departmentNo,
                        departmentName: wrongDepartmentName1,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Department({
                        departmentNo,
                        departmentName: wrongDepartmentName2,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Department({
                        departmentNo,
                        departmentName: wrongDepartmentName3,
                    }),
            ).toThrow();
            expect(
                () =>
                    new Department({
                        departmentNo,
                        departmentName: wrongDepartmentName4,
                    }),
            ).toThrow();
        });
        it('값이 올바르다면 엔티티를 생성해야 한다.', () => {
            expect(
                () =>
                    new Department({
                        departmentNo,
                        departmentName,
                    }),
            ).not.toThrow();
        });
    });
});
