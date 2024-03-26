import { Inter } from 'next/font/google';
import { generateRandomString } from './string.utils';

export const capturePhoto = (videoEl: HTMLVideoElement, ratio = 2) => {
  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth * ratio;
  canvas.height = videoEl.videoHeight * ratio;
  const context = canvas.getContext('2d')!;
  context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL('image/jpeg');
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  const file = new File([blob], `photo_${generateRandomString(15)}.jpg`, {
    type: 'image/jpeg',
  });
  return file;
};

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
