import { ErrorModal } from "@/components/ErrorModal";
import { ModalSpinner } from "@/components/Spinner";
import { useFetch } from "@/hooks/useFetch";
import { ICartItem, ICompletedTransaction, ICreateTransaction, IExistingOrder } from "@/interfaces/cart.interface";
import { IProduct } from "@/interfaces/products.interface";
import { StateSetter } from "@/interfaces/utils.interface";
import { generateRandomString } from "@/utils/string.utils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, ReactNode, createContext, useCallback, useContext, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { useCart } from "./CartContext";
import { useGlobalContext } from "./GlobalContext";

interface ICheckoutContext {
  isCheckingOut: boolean;
  setIsCheckingOut: StateSetter<boolean>;
  loading: boolean;
  onCreateCheckout: (
    existingOrder?: IExistingOrder,
    currentCheckoutProduct?: ICheckoutContext['checkoutCurrentProduct']
  ) => void;
  onOrderCreate: (items?: ICartItem[]) => Promise<void>;
  setCardExpires: StateSetter<string>;
  setCardNumber: StateSetter<string>;
  setSmsCode: StateSetter<string>;
  setStage: StateSetter<number>;
  smsCode: string;
  existingOrder: IExistingOrder | null;
  setExistingOrder: StateSetter<IExistingOrder | null>;
  checkoutCurrentProduct: {
    product: IProduct;
    quantity: number;
    onSuccess?: () => unknown;
  } | null;
  cardNumber: string;
  createTransaction: (orderId: number) => Promise<ICreateTransaction | undefined>;
  cardExpires: string;
  reset: () => void;
  confirmTransaction: (transactionId?: string) => Promise<ICompletedTransaction | undefined>;
  stage: number;
}

interface CheckoutContextProviderProps {
  children: ReactNode;
}

const CheckoutContext = createContext({} as ICheckoutContext);

export const useCheckoutContext = () => useContext(CheckoutContext);

export const CheckoutContextProvider: FC<CheckoutContextProviderProps> = ({ children, }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [cardExpires, setCardExpires] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [existingOrder, setExistingOrder] = useState<IExistingOrder | null>(null);
  const router = useRouter();
  const { totalPrice, cart, setShowCart, totalCount, clearCart } = useCart();
  const orderCreateFetch = useFetch();
  const createTransactionFetch = useFetch<ICreateTransaction>();
  const [checkoutCurrentProduct, setCheckoutCurrentProduct] = useState<ICheckoutContext['checkoutCurrentProduct']>(null);
  const confirmTransactionFetch = useFetch<ICompletedTransaction>();
  const { prisonerContactFetch, isApproved } = useAuthContext();
  const { setError } = useGlobalContext();
  const { t } = useTranslation();
  const [stage, setStage] = useState(0);

  const user = prisonerContactFetch.data;

  const createTransaction = useCallback(async (orderId: number) => {
    try {
      if (!cardNumber.length || !cardExpires || !orderId) return;

      const response = await createTransactionFetch.makeRequest({
        url: 'api/billing/pay-hold/',
        options: {
          method: 'POST',
          body: JSON.stringify({
            pan: cardNumber,
            expire: cardExpires,
            amount: totalPrice,
            orderId
          }),
          headers: {
            'Content-Type': 'application/json',
          }
        },
      });

      return response;
    } catch (er) {
      return {} as ICreateTransaction;
    }
  }, [cardNumber, cardExpires, totalPrice]);

  const reset = useCallback(() => {
    setSmsCode('');
    setIsCheckingOut(false);
    setCardExpires('');
    setCardNumber('');
    orderCreateFetch.setData(null);
    createTransactionFetch.setData(null);
    confirmTransactionFetch.setData(null);
    setStage(0);
    setCheckoutCurrentProduct(null);
    setExistingOrder(null);
    setShowCart(false);
  }, []);

  const confirmTransaction = useCallback(async (transactionIdArg?: string) => {
    try {
      const transactionId =
        transactionIdArg ||
        createTransactionFetch.data?.transactionId;

      if (!transactionId || !smsCode) {
        setError(t('somethingWrong'));
        reset();
        return;
      }

      const response = await confirmTransactionFetch.makeRequest({
        url: 'api/billing/pay-transaction/',
        options: {
          method: 'POST',
          body: JSON.stringify({
            transactionId,
            smsCode
          }),
          headers: {
            'Content-Type': 'application/json',
          }
        },
      });
      if (response?.status === 'completed') {
        if (response.qrCodeUrl) {
          window.open(response.qrCodeUrl, '_blank', 'noopener noreferrer');
        }

        const orderId = existingOrder?.id || orderCreateFetch.data?.data.id;
        const orderPage = `/profile/orders/${orderId}`;
        if (window.location.pathname.includes(orderPage)) {
          router.reload();
        } else {
          router.push(orderPage);
        }
        if (typeof existingOrder?.onSuccess === 'function') {
          await existingOrder?.onSuccess();
        }
        if (typeof checkoutCurrentProduct?.onSuccess === 'function') {
          await checkoutCurrentProduct?.onSuccess();
        }
      } else if ('errorMessage' in (response || {})) {
        setError(t('somethingWrong'));
      }
      reset();
      return response;
    } catch (er) {
      console.log('Error confirming transaction', er);
      return {} as ICompletedTransaction;
    }
  }, [
    smsCode,
    createTransactionFetch.data?.transactionId,
    existingOrder,
    orderCreateFetch.data,
    checkoutCurrentProduct
  ]);

  const onCreateCheckout = useCallback(
    (
      order?: IExistingOrder,
      currentCheckoutProduct?: ICheckoutContext['checkoutCurrentProduct']
    ) => {
      if (!user?.id) {
        router.push('/login');
        return;
      }

      if (!isApproved) {
        setError(t('notApproved'));
        return;
      }

      if (!totalCount && !order && !currentCheckoutProduct) {
        return;
      }

      if (order) {
        setExistingOrder(order);
      }

      if (currentCheckoutProduct) {
        setCheckoutCurrentProduct(currentCheckoutProduct);
      }

      setIsCheckingOut(true);
      setShowCart(false);
    },
    [user, totalCount, isApproved]
  );

  const createOrder = useCallback(
    async (cartItems: ICartItem[]): Promise<number | undefined> => {
      if (!user || !cartItems.length) return;

      const orderCreatePayload = {
        prisoner_id: user.prisoner,
        contact_id: user.id,
        products: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
      };

      const orderCreateResponse = await orderCreateFetch.makeRequest({
        url: 'create-full-order/',
        options: {
          method: 'POST',
          body: JSON.stringify(orderCreatePayload),
          headers: {
            'Content-Type': 'application/json',
          }
        },
      });

      if (
        orderCreateResponse?.status === 'success' &&
        orderCreateResponse.data.id
      ) {
        return orderCreateResponse.data.id;
      } else if (orderCreateResponse?.status === 'error') {
        setError(t('somethingWrong'));
        reset();
      }
    },
    [user, cart, reset]
  );

  const onOrderCreate = useCallback(async (cartItems = cart) => {
    try {
      if (!user?.id) return;

      let orderId = existingOrder?.id;

      if (!existingOrder) {
        orderId = (await createOrder(
          checkoutCurrentProduct
            ? [{
              product: checkoutCurrentProduct.product,
              quantity: checkoutCurrentProduct.quantity,
              id: generateRandomString(5),
            }]
            : cartItems
        ))!;
      }

      if (orderId) {
        const response = await createTransaction(orderId);

        clearCart();
        if (response?.transactionId) {
          setStage(p => p + 1);
        } else {
          setError(t('somethingWrong'));
          reset();
        }
      }
    } catch (er) {
      console.log('Error creating order', er);
      reset();
      setError(t('somethingWrong'));
    }
  }, [user, clearCart, createTransaction, existingOrder, cart,]);

  const loading = (
    orderCreateFetch.loading ||
    createTransactionFetch.loading ||
    confirmTransactionFetch.loading
  );

  const state: ICheckoutContext = {
    isCheckingOut,
    setIsCheckingOut,
    onOrderCreate,
    setExistingOrder,
    existingOrder,
    loading,
    onCreateCheckout,
    setCardExpires,
    createTransaction,
    checkoutCurrentProduct,
    reset,
    smsCode,
    confirmTransaction,
    setStage,
    stage,
    setSmsCode,
    setCardNumber,
    cardNumber,
    cardExpires,
  };

  return (
    <CheckoutContext.Provider value={state}>
      {loading && <ModalSpinner />}
      {isCheckingOut && !isApproved && (
        <ErrorModal
          onClose={() => setIsCheckingOut(false)}
          error={t('notApproved')}
          action={{
            label: t('close'),
            onAction: () => setIsCheckingOut(false)
          }}
        />
      )}
      {children}
    </CheckoutContext.Provider>
  );
};