DROP TABLE TBL_URL;
DROP TABLE TBL_USER;
DROP TABLE TBL_CATEGORY;

CREATE TABLE TBL_CATEGORY (
    Category_ID NUMBER(5) PRIMARY KEY,
    Category_Name VARCHAR2(50 CHAR) NOT NULL,
    Category_Desc VARCHAR2(4000 CHAR)
);

CREATE TABLE TBL_USER (
    User_ID NUMBER(5) PRIMARY KEY,
    User_Name VARCHAR2(50 CHAR) NOT NULL,
    User_Password VARCHAR2(50 CHAR) NOT NULL,
    User_Role VARCHAR2(50 CHAR) NOT NULL
);

CREATE TABLE TBL_URL (
    Url_ID NUMBER(5) PRIMARY KEY,
    Url_Tile VARCHAR2(50 CHAR) NOT NULL,
    Url_Link VARCHAR2(50 CHAR) NOT NULL,
    Url_Desc VARCHAR2(4000 CHAR) NOT NULL,
    Category_ID NUMBER(5) NULL,
    User_ID NUMBER(5) NULL,
    IsApproved VARCHAR2(1 CHAR) NULL,
    CONSTRAINT fk_url_category FOREIGN KEY (Category_ID) REFERENCES TBL_CATEGORY (Category_ID) ON DELETE CASCADE,
    CONSTRAINT fk_url_user FOREIGN KEY (User_ID) REFERENCES TBL_USER (User_ID) ON DELETE CASCADE
);

INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (1, 'Technology', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (2, 'Math and Science', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (3, 'Crafts and Hobbies', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (4, 'Business', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (5, 'Education', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (6, 'Sports', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (7, 'Design', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (8, 'Languages', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (9, 'Art and photography', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (10, 'Humanities', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (11, 'Other', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (12, 'Health and Fitness', '');
INSERT INTO "INTERSHIP"."TBL_CATEGORY" (Category_ID, Category_Name, Category_Desc) VALUES (13, 'Social Sciences', '');

INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (1, 'luusean@ablabba.com', 'sean080597', 'A');
INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (2, 'jack@safsa.com', 'jack@13', 'U');
INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (3, 'jessie@ablabba.com', 'Nam', 'U');
INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (4, 'macey@sssdasss.com', 'orci', 'U');
INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (5, 'Ulyssess@safsa.com', 'luscs', 'U');
INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (6, 'derel@asdaass.gox', 'metsu', 'U');
INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (7, 'kevin@ssdqgggf.com', 'Cras', 'U');
INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (8, 'Kolyer@joye.com', 'suspic', 'U');
INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (9, 'Drake@drakeeee.gox', 'auhue', 'U');
INSERT INTO "INTERSHIP"."TBL_USER" (User_ID, User_Name, User_Password, User_Role) VALUES (10, 'Louis@erat.com', 'In', 'U');

INSERT INTO "INTERSHIP"."TBL_URL" (Url_ID, Url_Tile, Url_Link, Category_ID, User_ID, IsApproved, Url_Desc) VALUES (1, 'proin', 'http://www.wooster.edu/', '1', '1', 'P', 'e content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribut');
INSERT INTO "INTERSHIP"."TBL_URL" (Url_ID, Url_Tile, Url_Link, Category_ID, User_ID, IsApproved, Url_Desc) VALUES (2, 'varius', 'http://www.molloy.edu/', '3', '8', 'R', 'e content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribut');
INSERT INTO "INTERSHIP"."TBL_URL" (Url_ID, Url_Tile, Url_Link, Category_ID, User_ID, IsApproved, Url_Desc) VALUES (3, 'femoii', 'http://www.mscfs.edu/', '6', '3', 'R', 'e content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribut');
INSERT INTO "INTERSHIP"."TBL_URL" (Url_ID, Url_Tile, Url_Link, Category_ID, User_ID, IsApproved, Url_Desc) VALUES (4, 'quiz', 'http://www.naz.edu/', '5', '3', 'A', 'e content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribut');
INSERT INTO "INTERSHIP"."TBL_URL" (Url_ID, Url_Tile, Url_Link, Category_ID, User_ID, IsApproved, Url_Desc) VALUES (5, 'lorem', 'http://www.faimon.edu/', '4', '6', 'A', 'e content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribut');
INSERT INTO "INTERSHIP"."TBL_URL" (Url_ID, Url_Tile, Url_Link, Category_ID, User_ID, IsApproved, Url_Desc) VALUES (6, 'verhi', 'http://www.miligan.edu/', '10', '10', 'A', 'e content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribut');
INSERT INTO "INTERSHIP"."TBL_URL" (Url_ID, Url_Tile, Url_Link, Category_ID, User_ID, IsApproved, Url_Desc) VALUES (7, 'elemii', 'http://www.nwmssi.edu/', '8', '4', 'P', 'e content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribut');
INSERT INTO "INTERSHIP"."TBL_URL" (Url_ID, Url_Tile, Url_Link, Category_ID, User_ID, IsApproved, Url_Desc) VALUES (8, 'quam', 'http://www.wooster.edu/', '5', '1', 'P', 'e content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribut');
INSERT INTO "INTERSHIP"."TBL_URL" (Url_ID, Url_Tile, Url_Link, Category_ID, User_ID, IsApproved, Url_Desc) VALUES (9, 'wowwowo', 'http://www.mscicnet.edu/', '7', '5', 'R', 'e content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribut');
