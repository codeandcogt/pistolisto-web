"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginCard() {
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault() 
    router.push('/workspace/dashboard') 
  }

  return (
    <Card className="w-full max-w-sm pt-7 pb-7">
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={handleLogin} type="button" className="w-full bg-lime-400 hover:bg-lime-600">
          Ingresar
        </Button>
      </CardFooter>
    </Card>
  )
}