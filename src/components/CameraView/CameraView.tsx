import { CameraValue } from "@/interfaces/media.interface";
import { capturePhoto } from "@/utils/media.utils";
import { useTranslation } from "next-i18next";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { FaceOval } from "../CustomIcons";
import Modal from "../Modal/Modal";
import styles from './CameraView.module.scss';

interface CameraViewProps {
  continueLabel?: string;
  onContinue: (photo: CameraValue) => unknown;
  modal?: {
    open: boolean;
    onClose: () => unknown;
  };
}

const CameraView: FC<CameraViewProps> = memo(({
  continueLabel,
  modal,
  onContinue
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<CameraValue>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let stream: MediaStream;
    if (!photo) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
          videoRef.current!.srcObject = mediaStream;
          stream = mediaStream;
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [photo]);

  const onTakePicture = useCallback(() => {
    if (!photo) {
      const photo = capturePhoto(videoRef.current!);
      setPhoto({
        file: photo,
        url: URL.createObjectURL(photo)
      });
      return;
    }
    onContinue(photo);
  }, [onContinue, photo]);

  let content = (
    <div className={styles.video}>
      <div className={styles.head}>
        <h2 className="heading--secondary">
          {t('infoCheck')}
        </h2>
        <p className="text-pale">
          {t('clearCamera')}
        </p>
      </div>
      <div className={styles.camera}>
        {photo ? (
          <figure>
            <img src={photo.url} />
          </figure>
        ) : (
          <video autoPlay playsInline ref={videoRef} />
        )}
        <FaceOval />
      </div>
      {photo && (
        <button
          title={t('tryAgain')}
          onClick={() => setPhoto(null)}
          className="btn btn--secondary btn--full"
        >
          {t('tryAgain')}
        </button>
      )}
      <button
        title={t('takePhoto')}
        onClick={onTakePicture}
        className="btn btn--full btn--primary"
      >
        {photo ? (continueLabel || t('continue')) : t('takePhoto')}
      </button>
    </div>
  );

  if (modal) {
    return (
      <Modal open={modal.open} onClose={modal.onClose}>
        {content}
      </Modal>
    );
  }

  return content;
});

CameraView.displayName = 'CameraView';

export default CameraView;