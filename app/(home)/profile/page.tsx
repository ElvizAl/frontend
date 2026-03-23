import type { Metadata } from "next";
import ProfileForm from "@/components/profile/profile-form";
import ChangePasswordForm from "@/components/profile/change-password-form";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Kelola informasi profil akun Anda",
};

export default function ProfilePage() {
  return (
    <>
      <ProfileForm />
      <div className="mx-auto max-w-2xl pb-10 px-4">
        <ChangePasswordForm />
      </div>
    </>
  );
}

