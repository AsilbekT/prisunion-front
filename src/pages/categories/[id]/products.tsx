import { CategoryProducts } from "@/components/CategoryProducts/CategoryProducts";
import { Layout } from "@/components/Layout";
import { ICategory } from "@/interfaces/category.interface";
import { IProduct } from "@/interfaces/products.interface";
import { IFetchResponse } from "@/interfaces/utils.interface";
import { fetchData } from "@/utils/fetch.utils";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface ProductsPageProps {
  firstProducts: IFetchResponse<IProduct[]> | null;
  category: ICategory;
}

const ProductsPage: NextPage<ProductsPageProps> = ({ firstProducts, category }) => {
  return (
    <Layout>
      <main>
        <CategoryProducts
          firstProducts={firstProducts}
          category={category}
        />
      </main>
    </Layout>
  );
};

export default ProductsPage;

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async (ctx) => {
  const categoryId = ctx.query.id;
  const locale = (ctx.locale || ctx.defaultLocale)!;
  const firstProducts = await fetchData<IProduct[]>(
    categoryId === 'popular'
      ? 'products/?trending=true'
      : `productcategories/${categoryId}/products/`
  );
  const category = await fetchData<ICategory>(
    `productcategories/${categoryId}/`,
    undefined,
    locale
  );

  return {
    props: {
      firstProducts,
      category: category?.data!,
      ...(await serverSideTranslations(locale, ['common'])),
    }
  };
};