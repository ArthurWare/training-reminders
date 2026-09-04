CREATE TABLE "reminders" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"due" date NOT NULL,
	"department" text DEFAULT '',
	"employee" text DEFAULT '',
	"email" text DEFAULT '',
	"source" text DEFAULT 'Manual entry',
	"schedule_on" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
