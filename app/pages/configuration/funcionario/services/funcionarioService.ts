import apiJava from "../../../../services/apiJava";

const FuncionarioService = {
  uploadPhoto: async (idFuncionario: string, uri: string) => {
    const formData = new FormData();

    // adiciona a foto (tipo multipart)
    formData.append("foto", {
      uri,
      name: "foto.jpg",
      type: "image/jpeg",
    } as any);

    const response = await apiJava.post(
      `/api/funcionarios/${idFuncionario}/photo`,
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

export default FuncionarioService;
