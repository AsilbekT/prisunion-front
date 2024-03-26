import { IBanner } from "@/interfaces/banners.interface";
import { groupArrayBy } from "@/utils/array.utils";
import Link from "next/link";
import { FC, memo, useMemo } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from './MobileBanners.module.scss';

interface MobileBannersProps {
  banners: IBanner[];
}

const MobileBanners: FC<MobileBannersProps> = memo(({ banners }) => {
  const groupedBannerEls = useMemo(() => {
    const groupedBanners = groupArrayBy<IBanner>(banners, 3);
    return groupedBanners.map((group, index) => {
      const innerEls = group.map((banner) => {
        return (
          <Link
            title={banner.title}
            key={banner.id}
            href={`/categories/${banner.category}/products`}
          >
            <figure>
              <img alt={banner.title} src={banner.image} />
            </figure>
            <span>
              {banner.title && (
                <span className="heading--4">
                  {banner.title}
                </span>
              )}
              {banner.description && (
                <p className="text-pale">{banner.description}</p>
              )}
            </span>
          </Link>
        );
      });
      return (
        <SwiperSlide className={styles.item} key={index}>
          {innerEls}
        </SwiperSlide>
      );
    });
  }, [banners]);

  return (
    <section className={styles.banners}>
      <div className="container">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000 }}
          loop
          spaceBetween={10}
          loopAdditionalSlides={3}
          slidesPerView={1}
        >
          {groupedBannerEls}
        </Swiper>
      </div>
    </section>
  );
});

MobileBanners.displayName = 'MobileBanners';

export default MobileBanners