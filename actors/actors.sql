DROP TABLE IF EXISTS actors;

CREATE TABLE actors (     
    name VARCHAR(255) NOT NULL, 
    age INTEGER,         
    "Number of oscars" INTEGER             
);

INSERT INTO actors (name, age, "Number of oscars") VALUES ('Leonardo DiCaprio', 41, 1);
INSERT INTO actors (name, age, "Number of oscars") VALUES ('Jennifer Lawrence', 25, 1);
INSERT INTO actors (name, age, "Number of oscars") VALUES ('Samuel L. Jackson', 67, 0);
INSERT INTO actors (name, age, "Number of oscars") VALUES ('Meryl Streep', 66, 3);
INSERT INTO actors (name, age, "Number of oscars") VALUES ('John Cho', 43, 0);

SELECT * FROM actors WHERE "Number of oscars">1;
SELECT * FROM actors WHERE age>30;

SELECT * FROM actors WHERE "Number of oscars">0 AND age>30;
--added extra query to see the result