import CameraView from "@/components/CameraView/CameraView";
import { ArrowIcon } from "@/components/CustomIcons";
import { CustomSelect } from "@/components/CustomSelect";
import { StepsBar } from "@/components/StepsBar/StepsBar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLoginContext } from "@/contexts/LoginContext";
import { PRISONER_RELATIONSHIP_OPTIONS } from "@/data/common.data";
import { useFetch } from "@/hooks/useFetch";
import { CameraValue } from "@/interfaces/media.interface";
import { setAuthTokens } from "@/utils/auth.utils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, memo, useCallback } from "react";
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
  const router = useRouter();
  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
  } = prisonerContactForm;
  const { register, handleSubmit, } = prisonerForm;
  const fetch = useFetch();
  const { t } = useTranslation();

  const subInfoPhaseIndex = phase - PERSONAL_INFO_PHASE_INDEX;

  const onSubmitContactForm = useCallback(
    handleSubmitContact(() => setPhase(p => p + 1)),
    []
  );

  const onSubmitForm = useCallback(handleSubmit(() => {
    setPhase(p => p + 1);
  }), []);

  const onSubmitPhoto = useCallback(async (photo: CameraValue) => {
    if (!photo) return;

    const prisoner = prisonerForm.getValues();
    const prisonerContact = prisonerContactForm.getValues();
    const formData = new FormData();

    formData.append('picture', photo.file);
    formData.append('full_name', `${prisonerContact.lastName} ${prisonerContact.firstName}`);
    formData.append('address', prisonerContact.address);
    formData.append('prisoner_full_name', `${prisoner.prisonerLastName} ${prisoner.prisonerFirstName}`);
    formData.append('relationship', prisoner.prisonerRelationship);
    formData.append('phone_number', phone.replace('+', '').replace(/\s/g, ''));

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
      router.replace('/');
    }
  }, [
    fetch.makeRequest,
    prisonerContactForm.getValues,
    phone,
    prisonerForm.getValues
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
      <label className="input-wrapper">
        <span className="text-pale">{t('address')}</span>
        <input
          className="input"
          placeholder={t('enter')}
          required
          {...registerContact('address', { required: true, })}
        />
      </label>
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