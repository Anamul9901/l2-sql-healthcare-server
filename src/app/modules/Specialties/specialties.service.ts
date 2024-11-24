import { Request } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";

const insertIntoDB = async (req: Request) => {
  console.log();
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllSpecialties = async () => {
  const result = await prisma.specialties.findMany();

  return result;
};

const deleteSpecialties = async (id: string) => {
  await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });

  return result;
};

export const SpecialtiesService = {
  insertIntoDB,
  getAllSpecialties,
  deleteSpecialties,
};
