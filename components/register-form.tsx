"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { signUpSchema } from "@/schema/userSchema";
import { registerAction } from "@/actions/register";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


const RegisterForm = () => {


  const { mutate, isPending } = useMutation({
    mutationFn: registerAction,

    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.data.successMesage)
      }

      if (!data.success) {
        toast.error(data.error.errorMessage)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const {
    register,
    trigger,
    reset,
    formState: { errors },
    getValues,
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  const submit = async () => {
    // trigger a userform to get values
    const val = await trigger();
    if (!val) {
      console.log("form not triggerd. trigger value -->", val);
      console.log(errors);

      return;
    }
    // get input values
    const inputValues = getValues(); //these value are viladated buy zod

    if (inputValues) {

      mutate(inputValues)
    }

    reset();
  };



  return (
    <form
      action={submit}
      className="flex  bg-slate-100 flex-col items-center justify-center gap-5"
    >
      <div>
        <label htmlFor="name">name</label>
        <Input type="text" {...register("name")} />
        {errors?.name && (
          <span className="text-sm text-red-400">{errors?.name.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">email</label>
        <Input type="email" {...register("email")} />
        {errors?.email && (
          <span className="text-sm text-red-400">{errors?.email?.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="password">password </label>
        <Input type="password" {...register("password")} />
        {errors?.password && (
          <span className="text-sm text-red-400">
            {errors?.password?.message}
          </span>
        )}
      </div> 

      {isPending ?

        <Button disabled >submitting ....</Button>
        :
        <Button type="submit" >submit</Button>

      }

    </form>
  );
};

export default RegisterForm;
