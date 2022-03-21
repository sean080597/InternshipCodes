DROP TABLE employee;
DROP TABLE department;

CREATE TABLE department (
    Department_ID NUMBER(5) PRIMARY KEY,
    Department_name VARCHAR2(50 CHAR),
    Department_head VARCHAR2(50 CHAR)
);

CREATE TABLE employee(
    Employee_ID NUMBER(5) PRIMARY KEY,
    Employee_name VARCHAR2(100 CHAR),
    Employee_department NUMBER(5),
    Employee_salary NUMBER(6),
    CONSTRAINT cons_employee_department_fk FOREIGN KEY (Employee_department) REFERENCES department (Department_ID) ON DELETE CASCADE
);

CREATE OR REPLACE TRIGGER department_trigger
BEFORE INSERT ON department
FOR EACH ROW
BEGIN
:new.Department_ID := department_auto_incr.nextval;
END;

CREATE OR REPLACE TRIGGER employee_trigger
BEFORE INSERT ON employee
FOR EACH ROW
BEGIN
:new.Employee_ID := employee_auto_incr.nextval;
END;

INSERT INTO "INTERSHIP"."DEPARTMENT" (Department_ID, DEPARTMENT_NAME, DEPARTMENT_HEAD) VALUES (1, 'DXC Technology', 'Mr.kkkkkk');
INSERT INTO "INTERSHIP"."DEPARTMENT" (Department_ID, DEPARTMENT_NAME, DEPARTMENT_HEAD) VALUES (2, 'Etown2', 'Mr.BSBABABABk');
INSERT INTO "INTERSHIP"."DEPARTMENT" (Department_ID, DEPARTMENT_NAME, DEPARTMENT_HEAD) VALUES (3, 'Etown3', 'Mr.AAAk');

INSERT INTO "INTERSHIP"."EMPLOYEE" (Employee_ID, EMPLOYEE_NAME, EMPLOYEE_DEPARTMENT, EMPLOYEE_SALARY) VALUES (1, 'LuuCuong', '1', '20000');
INSERT INTO "INTERSHIP"."EMPLOYEE" (Employee_ID, EMPLOYEE_NAME, EMPLOYEE_DEPARTMENT, EMPLOYEE_SALARY) VALUES (2, 'cluu', '2', '241244');
INSERT INTO "INTERSHIP"."EMPLOYEE" (Employee_ID, EMPLOYEE_NAME, EMPLOYEE_DEPARTMENT, EMPLOYEE_SALARY) VALUES (3, 'Lululu', '2', '34322');
INSERT INTO "INTERSHIP"."EMPLOYEE" (Employee_ID, EMPLOYEE_NAME, EMPLOYEE_DEPARTMENT, EMPLOYEE_SALARY) VALUES (4, 'LuuCsaas', '3', '3211');

select * from department