import { LoginConfirm } from "@/components/Login/Confirm/Confirm";
import { PersonalInfo } from "@/components/Login/PersonalInfo/PersonalInfo";
import { LoginPhone } from "@/components/Login/Phone/Phone";
import { useLoginContext } from "@/contexts/LoginContext";
import { FC } from "react";

const PHASE_COMPONENTS = [
  LoginPhone,
  LoginConfirm,
  PersonalInfo,
  PersonalInfo,
  PersonalInfo,
];

const Login: FC = () => {
  const { phase } = useLoginContext();

  const Component = PHASE_COMPONENTS[phase];

  if (!Component) return null;

  return (
    <main>
      <Component />
    </main>
  );
};

export default Login;