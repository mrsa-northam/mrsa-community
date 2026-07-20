alter table public.players
  add column if not exists usta_number text,
  add column if not exists usta_prompt_skipped_at timestamptz;
