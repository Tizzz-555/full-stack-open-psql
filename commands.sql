CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL, 
    title text NOT NULL, 
    likes integer DEFAULT 0
);

  INSERT INTO blogs (author, url, title, likes)
  VALUES ('Robert Martin', 'www.rbmrtn.com', 'Computer good', 23);


INSERT INTO blogs (url, title) VALUES ('www.github.com', 'How to git');