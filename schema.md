| table_name          | column_name           | data_type                |
| ------------------- | --------------------- | ------------------------ |
| events              | id                    | uuid                     |
| events              | creator_id            | uuid                     |
| event_creators      | updated_at            | timestamp with time zone |
| event_organizers    | id                    | uuid                     |
| event_organizers    | event_id              | uuid                     |
| event_organizers    | created_at            | timestamp with time zone |
| event_organizers    | updated_at            | timestamp with time zone |
| ticket_types        | id                    | uuid                     |
| ticket_types        | event_registration_id | uuid                     |
| ticket_types        | price                 | integer                  |
| ticket_types        | quantity              | integer                  |
| ticket_types        | created_at            | timestamp with time zone |
| ticket_types        | updated_at            | timestamp with time zone |
| event_registrations | id                    | uuid                     |
| event_registrations | event_id              | uuid                     |
| event_registrations | total_tickets         | integer                  |
| event_registrations | price                 | integer                  |
| event_registrations | created_at            | timestamp with time zone |
| event_registrations | updated_at            | timestamp with time zone |
| event_registrations | ticket_types          | jsonb                    |
| events              | start_datetime        | timestamp with time zone |
| events              | end_datetime          | timestamp with time zone |
| events              | created_at            | timestamp with time zone |
| events              | updated_at            | timestamp with time zone |
| events              | isVisible             | boolean                  |
| events              | isAvailable           | boolean                  |
| event_creators      | id                    | uuid                     |
| event_creators      | created_at            | timestamp with time zone |
| events              | name                  | character varying        |
| events              | mode                  | character varying        |
| event_creators      | professional_email    | character varying        |
| event_organizers    | college_email         | character varying        |
| events              | poster_url            | text                     |
| events              | location              | text                     |
| events              | description           | text                     |
| events              | category              | character varying        |
| events              | agenda                | text                     |
| event_organizers    | phone                 | character varying        |
| ticket_types        | name                  | character varying        |
| events              | location_data         | text                     |
| event_registrations | event_type            | character varying        |
| event_organizers    | name                  | character varying        |
| event_organizers    | personal_email        | character varying        |
| event_creators      | name                  | character varying        |
| event_creators      | phone                 | character varying        |
| event_creators      | personal_email        | character varying        |