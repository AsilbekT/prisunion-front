import { useGlobalContext } from "@/contexts/GlobalContext";
import { FC, ReactNode } from "react";
import CartDrawer from "./CartDrawer/CartDrawer";
import { Footer } from "./Footer/Footer";
import MobileNavigation from "./MobileNavigation/MobileNavigation";
import Navigation from "./Navigation/Navigation";
import SafeHydrate from "./SafeHydrate";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { media } = useGlobalContext();
  return (
    <>
      <SafeHydrate releaseContent>
        {media.tablet ? <MobileNavigation /> : <Navigation />}
        <CartDrawer />
      </SafeHydrate>
      <main>{children}</main>
      <SafeHydrate>
        {!media.tablet && <Footer />}
      </SafeHydrate>
    </>
  );
};