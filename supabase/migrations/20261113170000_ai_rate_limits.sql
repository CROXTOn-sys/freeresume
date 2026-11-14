create table if not exists public.api_rate_limits (
  rate_limit_key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0)
);

create index if not exists api_rate_limits_window_started_at_idx
  on public.api_rate_limits (window_started_at);

alter table public.api_rate_limits enable row level security;

revoke all on table public.api_rate_limits from public, anon, authenticated;
grant all on table public.api_rate_limits to service_role;

create or replace function public.consume_api_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table (allowed boolean, remaining integer)
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_now timestamptz := pg_catalog.clock_timestamp();
  result_row public.api_rate_limits%rowtype;
begin
  if p_key is null or p_limit < 1 or p_window_seconds < 1 then
    raise exception 'Invalid rate limit parameters';
  end if;

  insert into public.api_rate_limits as current_limit (rate_limit_key, window_started_at, request_count)
  values (p_key, v_now, 1)
  on conflict (rate_limit_key) do update
  set
    window_started_at = case
      when current_limit.window_started_at <= v_now - pg_catalog.make_interval(secs => p_window_seconds)
        then v_now
      else current_limit.window_started_at
    end,
    request_count = case
      when current_limit.window_started_at <= v_now - pg_catalog.make_interval(secs => p_window_seconds)
        then 1
      else current_limit.request_count + 1
    end
  returning * into result_row;

  return query
  select result_row.request_count <= p_limit,
    greatest(p_limit - result_row.request_count, 0);
end;
$$;

revoke all on function public.consume_api_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, integer, integer) to service_role;
