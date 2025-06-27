ALTER TABLE "files" ALTER COLUMN "url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "tags" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "parsed_content" text;--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN "metadata";