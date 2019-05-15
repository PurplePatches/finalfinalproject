DROP TABLE IF EXISTS accounts CASCADE;
CREATE TABLE accounts(
    
    id SERIAL PRIMARY KEY,
    code INTEGER,
    chats VARCHAR,
    drawing TEXT CHECK (drawing <> '')
);
