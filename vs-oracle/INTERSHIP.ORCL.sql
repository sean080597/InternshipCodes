--SELECT SYSTIMESTAMP, 'Hellu World', 5*55 FROM DUAL

--DROP TABLE projects;
--DROP TABLE users;
--DROP TABLE project_users;
--
--CREATE TABLE users(
--    --userID NUMBER NOT NULL UNIQUE,
--    userID NUMBER PRIMARY KEY,
--    userName VARCHAR2(50 CHAR) NOT NULL UNIQUE,
--    sex CHAR(1) DEFAULT 0,
--    CONSTRAINT cons_users_sex CHECK (sex IN ('1', '0'))
--);
--
--CREATE TABLE projects(
--    projectID NUMBER,
--    projectName VARCHAR2(50 CHAR) UNIQUE,
--    creator NUMBER NOT NULL,
--    CONSTRAINT cons_projects_pk PRIMARY KEY (projectID),
--    CONSTRAINT cons_projects_users_fk FOREIGN KEY (creator) REFERENCES users (userID) ON DELETE CASCADE
--);
--
--
--CREATE TABLE project_users(
--    userID NOT NULL REFERENCES users(userID) ON DELETE CASCADE,
--    projectID NOT NULL REFERENCES projects(projectID) ON DELETE CASCADE,
--    CONSTRAINT con_project_users_pk PRIMARY KEY (userID, projectID)
--)
--
--
--INSERT INTO users VALUES (1, 'LuuCuong', '1');
--INSERT INTO users VALUES (2, 'JOEJDO', '1');
--INSERT INTO users VALUES (3, 'Capheny', '0');
--
--INSERT INTO projects VALUES (23, 'Legit Project', 1);
--INSERT INTO projects VALUES (14, 'JPAN Project', 2);
--
--INSERT INTO project_users VALUES (1, 23);
--
--
--
--delete from projects where projectID = 23;
--select * from projects

CREATE INDEX projects_creator_ix ON projects (creator);
DROP INDEX projects_creator_ix;


