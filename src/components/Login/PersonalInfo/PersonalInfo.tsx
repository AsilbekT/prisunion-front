import CameraView from "@/components/CameraView/CameraView";
import { ArrowIcon, CalendarIcon } from "@/components/CustomIcons";
import { CustomSelect } from "@/components/CustomSelect";
import { StepsBar } from "@/components/StepsBar/StepsBar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLoginContext } from "@/contexts/LoginContext";
import { PRISONER_RELATIONSHIP_OPTIONS } from "@/data/common.data";
import { useFetch } from "@/hooks/useFetch";
import { CameraValue } from "@/interfaces/media.interface";
import { setAuthTokens } from "@/utils/auth.utils";
import { getPayloadDate } from "@/utils/date.utils";
import { ru } from 'date-fns/locale/ru';
import { uz } from 'date-fns/locale/uz';
import { useTranslation } from "next-i18next";
import { FC, memo, useCallback, useEffect, useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import styles from './PersonalInfo.module.scss';

const PERSONAL_INFO_PHASE_INDEX = 2;

export const PersonalInfo: FC = memo(() => {
  const {
    prisonerContactForm,
    setPhase,
    phase,
    prisonerForm,
    phone,
  } = useLoginContext();
  const { setTokens } = useAuthContext();
  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
  } = prisonerContactForm;
  const { register, handleSubmit, } = prisonerForm;
  const fetch = useFetch();
  const { t, i18n } = useTranslation();
  const [prisonerBirthday, setPrisonerBirthday] = useState(new Date());
  const [prisonerContactBirthday, setPrisonerContactBirthday] = useState(new Date());

  const subInfoPhaseIndex = phase - PERSONAL_INFO_PHASE_INDEX;

  const onSubmitContactForm = useCallback(
    handleSubmitContact(() => setPhase(p => p + 1)),
    []
  );

  useEffect(() => {
    registerLocale('ru', ru);
    registerLocale('uz', uz);
  }, []);

  useEffect(() => {
    setDefaultLocale(i18n.language);
  }, [i18n.language]);

  const onSubmitForm = useCallback(handleSubmit(() => {
    setPhase(p => p + 1);
  }), []);

  const prisonerContactValues = prisonerContactForm.getValues();
  const prisonerValues = prisonerForm.getValues();

  const onSubmitPhoto = useCallback(async (photo: CameraValue) => {
    if (!photo) return;

    const formData = new FormData();

    formData.append('picture', photo.file);
    formData.append('full_name', `${prisonerContactValues.lastName} ${prisonerContactValues.firstName}`);
    formData.append('address', prisonerContactValues.address);
    formData.append('prisoner_full_name', `${prisonerValues.prisonerLastName} ${prisonerValues.prisonerFirstName}`);
    formData.append('relationship', prisonerValues.prisonerRelationship);
    formData.append('phone_number', phone.replace('+', '').replace(/\s/g, ''));
    formData.append(
      'prisoner_passport_id',
      `${prisonerValues.passportSerial}${prisonerValues.passportId}`.toUpperCase()
    );
    formData.append('prisoner_date_of_birth', getPayloadDate(prisonerBirthday));
    formData.append('date_of_birth', getPayloadDate(prisonerContactBirthday));
    formData.append(
      'passport_id',
      `${prisonerContactValues.passportSerial}${prisonerContactValues.passportId}`.toUpperCase()
    );

    const response = await fetch.makeRequest({
      url: 'api/create_prisoner_contact/',
      options: {
        method: 'POST',
        body: formData
      }
    });

    if (response?.status === 'success' && response.data?.tokens) {
      setTokens(response.data.tokens);
      setAuthTokens(response.data.tokens);
      setTimeout(() => {
        window.location.pathname = '/';
      }, 500);
    }
  }, [
    fetch.makeRequest,
    prisonerContactValues,
    phone,
    prisonerValues
  ]);

  const subPhaseForm = [
    <form key={0} className={styles.form} onSubmit={onSubmitContactForm}>
      <div className={styles.formHead}>
        <h2 className="heading--secondary">
          {t('personalInfo')}
        </h2>
        <p className="text-pale">
          {t('enterPersonalInfo')}
        </p>
      </div>
      <label className="input-wrapper">
        <span className="text-pale">{t('name')}</span>
        <input
          className="input"
          placeholder={t('enter')}
          required
          {...registerContact('firstName', { required: true, })}
        />
      </label>
      <label className="input-wrapper">
        <span className="text-pale">{t('lastName')}</span>
        <input
          className="input"
          placeholder={t('enter')}
          required
          {...registerContact('lastName', { required: true, })}
        />
      </label>
      <div className="input-wrapper">
        <span className="text-pale">{t('passport')}</span>
        <div className={styles.inputGroup}>
          <input
            className="input"
            placeholder="AB"
            required
            {...registerContact('passportSerial', { required: true })}
          />
          <input
            className="input"
            placeholder="1234567"
            type="number"
            required
            {...registerContact('passportId', { required: true, })}
          />
        </div>
      </div>
      <label className="input-wrapper">
        <span className="text-pale">{t('address')}</span>
        <input
          className="input"
          placeholder={t('enter')}
          required
          {...registerContact('address', { required: true, })}
        />
      </label>
      <div className="input-wrapper">
        <span className="text-pale">{t('birthday')}</span>
        <div className={styles.date}>
          <DatePicker
            className="input"
            locale={i18n.language}
            selected={prisonerContactBirthday}
            onChange={(d) => setPrisonerContactBirthday(d!)}
          />
          <CalendarIcon />
        </div>
      </div>
      <div className={styles.footer}>
        <button
          className="btn btn--rounded btn--primary"
          title={t('continue')}
          type="submit"
        >
          <ArrowIcon />
        </button>
      </div>
    </form>,
    <form key={1} className={styles.form} onSubmit={onSubmitForm}>
      <div className={styles.formHead}>
        <h2 className="heading--secondary">
          {t('prisonerInfo')}
        </h2>
        <p className="text-pale">
          {t('enterPrisonerInfo')}
        </p>
      </div>
      <label className="input-wrapper">
        <span className="text-pale">{t('name')}</span>
        <input
          className="input"
          placeholder={t('enter')}
          required
          {...register('prisonerFirstName', { required: true, })}
        />
      </label>
      <label className="input-wrapper">
        <span className="text-pale">{t('lastName')}</span>
        <input
          className="input"
          placeholder={t('enter')}
          required
          {...register('prisonerLastName', { required: true, })}
        />
      </label>
      <div className="input-wrapper">
        <span className="text-pale">{t('passport')}</span>
        <div className={styles.inputGroup}>
          <input
            className="input"
            placeholder="AB"
            {...register('passportSerial')}
          />
          <input
            className="input"
            placeholder="1234567"
            type="number"
            {...register('passportId')}
          />
        </div>
      </div>
      <div className="input-wrapper">
        <span className="text-pale">{t('birthday')}</span>
        <div className={styles.date}>
          <DatePicker
            className="input"
            locale={i18n.language}
            selected={prisonerBirthday}
            onChange={(d) => setPrisonerBirthday(d!)}
          />
          <CalendarIcon />
        </div>
      </div>
      <CustomSelect
        label={t('relationship')}
        options={PRISONER_RELATIONSHIP_OPTIONS.map((value) => ({
          label: t(`relationships.${value}`),
          value
        }))}
        {...register('prisonerRelationship', { required: true, })}
      />
      <div className={styles.footer}>
        <button
          className="btn btn--rounded btn--primary"
          title={t('continue')}
          type="submit"
        >
          <ArrowIcon />
        </button>
      </div>
    </form>,
    <div key={2} className={styles.form}>
      <CameraView onContinue={onSubmitPhoto} />
    </div>
  ];

  return (
    <div className={styles.info}>
      <div className={styles.content}>
        <div className={styles.head}>
          <StepsBar
            stepsCount={3}
            currentStep={phase - PERSONAL_INFO_PHASE_INDEX}
            title={t('enterInfo')}
          />
        </div>
        {subPhaseForm[subInfoPhaseIndex]}
      </div>
    </div>
  );
});

PersonalInfo.displayName = 'PersonalInfo';