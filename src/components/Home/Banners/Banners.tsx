import { IBanner } from "@/interfaces/banners.interface";
import Link from "next/link";
import { FC, memo, useMemo } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from './Banners.module.scss';

interface BannerProps {
  banners: IBanner[];
}

const Banners: FC<BannerProps> = memo(({ banners }) => {
  const bannerEls = useMemo(() => {
    return banners.map(banner => {
      return (
        <SwiperSlide key={banner.id} className={styles.banner}>
          <Link href={`/categories/${banner.category}/products`} title={banner.title}>
            <figure className="sixteen-nine">
              <img src={banner.image} alt={banner.title} />
            </figure>
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
          </Link>
        </SwiperSlide>
      );
    });
  }, [banners]);

  return (
    <section className={styles.banners}>
      <div className="container">
        <Swiper
          className={styles.container}
          modules={[Autoplay]}
          loop
          loopAdditionalSlides={5}
          autoplay={{ delay: 3000 }}
          slidesPerView={1}
        >
          {bannerEls}
        </Swiper>
      </div>
    </section>
  );
});

Banners.displayName = 'Banners';

export default Banners;