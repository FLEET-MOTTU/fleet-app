import apiJava from "../../../../services/apiJava";

const AccountPhotoService = {
  upload: async (id: string, fileUri: string) => {
    const formData = new FormData();

    formData.append("foto", {
      uri: fileUri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);

    const response = await apiJava.post(
      `/api/funcionarios/${id}/photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

export default AccountPhotoService;
