import Image from "next/image";
import { Inter } from "next/font/google";
import { SubmitBtn } from "@/Components/SubmitBtn";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Router from "next/router";
import { uploadFile } from "@/Services";

const inter = Inter({ subsets: ["latin"] });

type Data = {
  file: FileList;
};

export default function Home() {
  const schema = yup.object().shape({
    file: yup
      .mixed<FileList>()
      .required("Importar é obrigatório")
      .test("is-file-selected", "Importar é obrigatório", (value) => {
        return value && value.length > 0;
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleSubmitForm = handleSubmit(async (data: Data) => {
    console.log(data);
    await uploadFile(data);
    Router.push("/dashboard");
  });

  return (
    <div className="flex items-center justify-center">
      <form
        className="flex flex-col w-full items-center justify-center mt gap-2 bg-white p-8 border border-gray-150 border-solid mx-w-md"
        encType="multipart/form-data"
        onSubmit={handleSubmitForm}
      >
        <h1 className="text-center capitalize text-3xl">Bem Vindo</h1>
        <label className="flex flex-col">
          <span className="ml-1">Adicione uma base de dados do tipo csv</span>
          <input
            className="p-2 rounded-md border-gray-400 border-solid border-2 enabled:hover:border-blue-500 focus:border-blue-700 outline-none"
            type="file"
            multiple
            accept=".csv"
            {...register("file")}
          />
          {errors.file && (
            <p className="text-red-600 text-sm font-mono">
              {errors.file.message}
            </p>
          )}
        </label>
        <SubmitBtn>Enviar</SubmitBtn>
      </form>
    </div>
  );
}
