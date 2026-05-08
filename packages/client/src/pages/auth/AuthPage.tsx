import Login from "@/components/auth/login/Login";
import AuthLayout from "@/components/auth/layout/AuthLayout";

export default function AuthPage() {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}
