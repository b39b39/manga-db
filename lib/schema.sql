-- NeonDB schema for manga-db
-- Run this in the NeonDB SQL console to initialize the database

CREATE TABLE IF NOT EXISTS manga (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  alias      TEXT[]    DEFAULT '{}',
  author     TEXT[]    DEFAULT '{}',
  rate       NUMERIC(3, 1) CHECK (rate >= 0.0 AND rate <= 10.0) DEFAULT 0.0,
  image      TEXT      DEFAULT '',
  icon       TEXT      DEFAULT '',
  summary    TEXT      DEFAULT '',
  review     TEXT      DEFAULT '',
  genre      TEXT[]    DEFAULT '{}',
  state      TEXT      CHECK (state IN ('ongoing', 'completed', 'hiatus')) DEFAULT 'ongoing',
  updated    TIMESTAMPTZ DEFAULT NOW(),
  created    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common query patterns
CREATE INDEX IF NOT EXISTS idx_manga_updated ON manga (updated DESC);
CREATE INDEX IF NOT EXISTS idx_manga_rate    ON manga (rate DESC);
CREATE INDEX IF NOT EXISTS idx_manga_name    ON manga USING gin (to_tsvector('simple', name));

-- Sample data
INSERT INTO manga (name, alias, author, rate, image, icon, summary, review, genre, state, updated, created)
VALUES
  (
    'Berserk',
    ARRAY['베르세르크'],
    ARRAY['Kentaro Miura'],
    9.8,
    'https://res.cloudinary.com/demo/image/upload/berserk.jpg',
    'https://res.cloudinary.com/demo/image/upload/berserk_icon.jpg',
    'The dark fantasy epic following Guts, a lone mercenary, and his struggle against demonic forces.',
    'One of the greatest manga ever created. The artwork is unparalleled and the story grips you from page one.',
    ARRAY['Action', 'Dark Fantasy', 'Adventure'],
    'hiatus',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '30 years'
  ),
  (
    'Vinland Saga',
    ARRAY['빈란드 사가'],
    ARRAY['Makoto Yukimura'],
    9.3,
    'https://res.cloudinary.com/demo/image/upload/vinland.jpg',
    'https://res.cloudinary.com/demo/image/upload/vinland_icon.jpg',
    'A historical manga set in Viking-age Europe, following Thorfinn on his journey for revenge.',
    'A masterful blend of historical accuracy and compelling character arcs. The pacifist arc is brilliant.',
    ARRAY['Action', 'Historical', 'Adventure'],
    'ongoing',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '20 years'
  ),
  (
    'Vagabond',
    ARRAY['배가본드'],
    ARRAY['Takehiko Inoue'],
    9.5,
    'https://res.cloudinary.com/demo/image/upload/vagabond.jpg',
    'https://res.cloudinary.com/demo/image/upload/vagabond_icon.jpg',
    'The fictionalized life of Miyamoto Musashi, the legendary Japanese swordsman.',
    'Breathtaking artwork and profound philosophical themes. A must-read for any manga enthusiast.',
    ARRAY['Action', 'Historical', 'Drama'],
    'hiatus',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '25 years'
  );
