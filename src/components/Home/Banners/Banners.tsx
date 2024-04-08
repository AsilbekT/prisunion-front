import { useGlobalContext } from "@/contexts/GlobalContext";
import { IBanner } from "@/interfaces/banners.interface";
import { cloneArrayTimes } from "@/utils/array.utils";
import Link from "next/link";
import { FC, memo, useLayoutEffect, useMemo, useRef } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import styles from './Banners.module.scss';

interface BannerProps {
  banners: IBanner[];
}

const Banners: FC<BannerProps> = memo(({ banners }) => {
  const swiperRef = useRef<SwiperRef>(null);
  const { media } = useGlobalContext();

  const bannerEls = useMemo(() => {
    return cloneArrayTimes(banners, 10).map((banner, index) => {
      return (
        <SwiperSlide key={`${index}-${banner.id}`} className={styles.banner}>
          <Link href={`/categories/${banner.category}/products`} title={banner.title}>
            <figure className="sixteen-nine">
              <img src={banner.image} alt={banner.title} />
            </figure>
            {(banner.title || banner.description) && (
              <span>
                {banner.title && (
                  <span className="heading--primary">
                    {banner.title}
                  </span>
                )}
                {banner.description && (
                  <p className="text-pale">{banner.description}</p>
                )}
              </span>
            )}
          </Link>
        </SwiperSlide>
      );
    });
  }, [banners]);

  useLayoutEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (swiper && !media.tablet) {
      swiper.slideTo(Math.floor(swiper.slides.length / 2), 0);
    }
  }, [media.tablet]);

  return (
    <section className={styles.banners}>
      <div className="container">
        <Swiper
          ref={swiperRef}
          className={styles.container}
          modules={[Autoplay]}
          loop
          loopAdditionalSlides={100}
          autoplay={{ delay: 4000 }}
          slidesPerView={1}
          breakpoints={{
            1025: {
              slidesPerView: 2,
              spaceBetween: 20,
              centeredSlides: true
            }
          }}
        >
          {bannerEls}
        </Swiper>
      </div>
    </section>
  );
});

Banners.displayName = 'Banners';

export default Banners;