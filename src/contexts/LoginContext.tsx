import { PRISONER_RELATIONSHIP_OPTIONS } from "@/data/common.data";
import { IPrisonerContactForm, IPrisonerForm } from "@/interfaces/auth.interface";
import { StateSetter } from "@/interfaces/utils.interface";
import { getFutureTimeBySeconds } from "@/utils/date.utils";
import parsePhoneNumber from 'libphonenumber-js';
import { FC, ReactNode, createContext, useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useTimer } from "react-timer-hook";

interface ILoginContext {
  phase: number;
  setPhase: StateSetter<number>;
  phone: string;
  confirmationTimer: ReturnType<typeof useTimer>;
  onPhoneValueChange: (val: string) => void;
  prisonerContactForm: ReturnType<typeof useForm<IPrisonerContactForm>>;
  prisonerForm: ReturnType<typeof useForm<IPrisonerForm>>;
}

interface LoginContextProviderProps {
  children: ReactNode;
}

const LoginContext = createContext({} as ILoginContext);

export const useLoginContext = () => useContext(LoginContext);

export const LoginContextProvider: FC<LoginContextProviderProps> = ({ children, }) => {
  const [phase, setPhase] = useState(2);
  const [phone, setPhone] = useState('+998 ');

  const prisonerContactForm = useForm<IPrisonerContactForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      passportSerial: '',
      passportId: '',
    },
  });

  const prisonerForm = useForm<IPrisonerForm>({
    defaultValues: {
      prisonerRelationship: PRISONER_RELATIONSHIP_OPTIONS[0],
      prisonerLastName: '',
      prisonerFirstName: '',
      passportSerial: '',
      passportId: '',
    },
  });

  const confirmationTimer = useTimer({
    expiryTimestamp: getFutureTimeBySeconds(60),
    autoStart: false,
  });

  const onPhoneValueChange = useCallback((val: string) => {
    let value = val;
    const parsedPhoneNumber = parsePhoneNumber(val, 'UZ');
    if (parsedPhoneNumber) {
      value = parsedPhoneNumber.formatInternational();
    }
    setPhone(value);
  }, []);

  const state: ILoginContext = {
    phase,
    phone,
    setPhase,
    confirmationTimer,
    onPhoneValueChange,
    prisonerContactForm,
    prisonerForm,
  };

  return (
    <LoginContext.Provider value={state}>
      {children}
    </LoginContext.Provider>
  );
};