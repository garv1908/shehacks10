-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  location USER-DEFINED,
  name text NOT NULL UNIQUE,
  interests ARRAY NOT NULL,
  meeting_places ARRAY NOT NULL,
  last_seen timestamp without time zone NOT NULL,
  expo_push_token text,
  id uuid NOT NULL DEFAULT auth.uid() UNIQUE,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);