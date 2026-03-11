-- drop table codes;

create table if not exists codes (
	id bigserial primary key, -- bigserial gives more possible values than serial, without any significant performance difference
	code text unique not null,
	url text not null,
	created_at timestamptz default now()
);

create index if not exists idx_codes_code on codes (code);