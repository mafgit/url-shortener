-- drop table codes;

create table if not exists codes (
	id serial primary key,
	code text unique not null,
	url text not null
);