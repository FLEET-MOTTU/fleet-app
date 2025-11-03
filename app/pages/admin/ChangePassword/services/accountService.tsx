import apiJava from "../../../../services/apiJava";

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

const AccountService = {
  changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
    await apiJava.put("/account/change-password", payload);
    // 204 No Content em caso de sucesso
  },
};

export default AccountService;
