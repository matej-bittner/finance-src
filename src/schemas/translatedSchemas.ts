import { getTranslations } from "next-intl/server";
import { getAddGoalSchema, getRegisterSchema } from "@/schemas/index";

export async function getTranslatedAddGoalSchema() {
  const t = await getTranslations("form-messages");
  return getAddGoalSchema(t);
}
