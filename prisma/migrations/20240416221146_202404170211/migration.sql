-- CreateEnum
CREATE TYPE "participant_role_enum" AS ENUM ('professional', 'student');

-- CreateTable
CREATE TABLE "coupons" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255),
    "speaker_id" INTEGER NOT NULL,
    "discount_percent" INTEGER,
    "description" TEXT,
    "valid_until" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6),

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "location" VARCHAR(255) NOT NULL,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER,
    "type" "participant_role_enum" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6),

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "role" "participant_role_enum" NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "doc_no" VARCHAR(120) NOT NULL,
    "event_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER,
    "event_id" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "coupon_id" INTEGER,
    "package_id" INTEGER,
    "url" VARCHAR(2048),
    "message" TEXT,
    "type" VARCHAR(255),
    "transaction_id" VARCHAR(255),
    "status" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speakers" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "organization" VARCHAR(255) NOT NULL,
    "photo_url" VARCHAR(255),
    "biography" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6),

    CONSTRAINT "speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_speakers" (
    "id" SERIAL NOT NULL,
    "speaker_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "event_speakers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "speakers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_speakers" ADD CONSTRAINT "event_speakers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_speakers" ADD CONSTRAINT "event_speakers_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "speakers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
