import { PasswordResetChannelType } from "../../../shared/interface";

export interface ForgetPasswordPayload {
  uid: string;
  channelType?: PasswordResetChannelType;
}
export type IPasswordChangeWithOldPassword = {
  oldPassword: string;
  newPassword: string;
};
