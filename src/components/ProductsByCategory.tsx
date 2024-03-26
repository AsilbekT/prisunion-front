import { useGlobalContext } from "@/contexts/GlobalContext";
import { FC, useMemo } from "react";
import { ProductsGroup } from "./ProductsGroup/ProductsGroup";

export const ProductsByCategory: FC = () => {
  const { categories } = useGlobalContext();

  const categoryProductEls = useMemo(() => {
    return categories.map(category => {
      return (
        <ProductsGroup
          fetchLink={`productcategories/${category.id}/products/`}
          key={category.id}
          isModalProduct
          title={category.name}
          categoryId={category.id}
        />
      );
    });
  }, [categories]);

  return categoryProductEls;
};