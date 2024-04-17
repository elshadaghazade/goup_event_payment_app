import { participant_role_enum } from "@prisma/client";

export interface CreateParticipantParamsType {
    role: participant_role_enum,
    name: string;
    email: string;
    doc_no: string;
}

export interface ParticipantType {
  id: number;
  role: participant_role_enum;
  name: string;
  email: string;
  doc_no: string;
}