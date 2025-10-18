"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginCard() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    console.log("Datos del formulario:", data);

    mutate(
      {
        email: data.email,
        contrasena: data.password,
      },
      {
        onSuccess: () => {
          toast.success("¡Inicio de sesión exitoso!", {
            description: "Bienvenido de nuevo, nos alegra verte",
          });
          router.push("/workspace/dashboard");
        },
        onError: (error) => {
          toast.error("Error al iniciar sesión", {
            description: "Verifica tus credenciales e inténtalo nuevamente.",
          });
          console.error("Error en login:", error);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-sm pt-7 pb-7">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              <p className="text-sm text-red-500">
                {errors.email && errors.email.message}
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-sm text-red-500">
                {errors.password && errors.password.message}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-5">
          <Button
            type="submit"
            disabled={isPending || isSubmitting}
            className="w-full bg-lime-400 hover:bg-lime-600"
          >
            {isPending ? "Ingresando..." : "Ingresar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
