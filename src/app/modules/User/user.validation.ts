import { Gender } from "@prisma/client";
import { z } from "zod";

const createAdmn = z.object({
  password: z.string({
    required_error: "Password is required!",
  }),
  admin: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z.string({
      required_error: "Email is required!",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required!",
    }),
  }),
});

const createDoctor = z.object({
  password: z.string({
    required_error: "Password is required!",
  }),
  doctor: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email("Invalid email format!"),
    contactNumber: z.string({
      required_error: "Contact Number is required!",
    }),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "Registration Number is required!",
    }),
    experience: z.number().optional().default(0),
    gender: z.enum([Gender.MALE, Gender.FEMALE], {
      required_error: "Gender is required!",
    }),
    appointmentFee: z.number({
      required_error: "Appointment Fee is required!",
    }),
    qualification: z.string({
      required_error: "Qualification is required!",
    }),
    currentWorkingPlace: z.string({
      required_error: "Current Working Place is required!",
    }),
    designations: z.string({
      required_error: "Designations are required!",
    }),
    profilePhoto: z.string().optional(),
  }),
});

const createPatient = z.object({
  password: z.string({
    required_error: "Password is required!",
  }),
  patient: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email("Invalid email format!"),
    contactNumber: z.string({
      required_error: "Contact Number is required!",
    }),
    address: z.string().optional(),
    profilePhoto: z.string().optional(),
  }),
});

export const userVlidation = {
  createAdmn,
  createDoctor,
  createPatient
};
