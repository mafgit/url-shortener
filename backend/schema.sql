drop table clicks;
drop table codes;

create table if not exists codes (
	id bigserial primary key, -- bigserial gives more possible values than serial, without any significant performance difference
	code text unique not null,
	url text not null,
	created_at timestamptz default now(),
	expires_at timestamptz,
	ip inet not null
);

create index if not exists idx_codes_code on codes (code);

create table if not exists clicks (
	id bigserial primary key,
	code_id bigint references codes(id) on delete cascade not null,
	ip inet not null,
	created_at timestamptz default now(),
	user_agent text
)