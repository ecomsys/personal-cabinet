import { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { useNavigate, Link } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { Button, Input } from "../components/ui";

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, handleSubmit } = useAuthForm(
    register,
    () => navigate("/")
  );

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <form
        onSubmit={(e) => handleSubmit(email, password, e)}
        className="bg-white p-8 rounded-2xl shadow-lg w-80 space-y-5"
      >
        <h2 className="text-2xl font-semibold text-center text-teal-800">
          Register
        </h2>

        <Input
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <Input
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Button loading={loading} className="w-full">
          Create account
       </Button>


        <p className="text-sm text-center text-gray-600">
          Already have account?{" "}
          <Link className="text-teal-700 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}