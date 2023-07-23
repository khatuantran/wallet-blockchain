CREATE TABLE "public"."wallet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userName" text,
    "password" text,
    "privateKey"    text,
    unique("userName")
);

CREATE TABLE "public"."chain" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "blockchain" jsonb
);