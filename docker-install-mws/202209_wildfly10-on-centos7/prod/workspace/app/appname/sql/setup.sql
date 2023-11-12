CREATE DATABASE your_db;
\c your_db

CREATE TABLE your_table (
  "foo" VARCHAR (50) NOT NULL
);

INSERT INTO your_table VALUES('a');
INSERT INTO your_table VALUES('b');
INSERT INTO your_table VALUES('c');

\COPY your_table FROM '/app/appname/data/setup_data1.csv' WITH (FORMAT CSV, HEADER, QUOTE '"');
