import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import {
    fetchAddress,
    getError,
    getLoadingStatus,
    getUserAddress,
} from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str,
    );

function CreateOrder() {
    const { username, position } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    // const [withPriority, setWithPriority] = useState(false);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    const formErrors = useActionData();

    const cart = useSelector(getCart);
    const address = useSelector(getUserAddress);
    const status = useSelector(getLoadingStatus);
    const error = useSelector(getError);
    const isAddressLoading = status === 'loading';

    if (!cart.length) {
        return <EmptyCart />;
    }

    return (
        <div className='py-2'>
            <h2 className='mb-8 text-xl font-semibold'>
                Ready to order? Lets go!
            </h2>

            <Form method='POST'>
                <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
                    <label className='sm:basis-40'>First Name</label>
                    <input
                        type='text'
                        name='customer'
                        required
                        className='input grow'
                        defaultValue={username}
                    />
                </div>

                <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
                    <label className='sm:basis-40'>Phone number</label>
                    <div className='grow'>
                        <input
                            type='tel'
                            name='phone'
                            required
                            className='input w-full'
                        />
                        {formErrors?.phone && (
                            <p className='mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700'>
                                {formErrors.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div className='relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
                    <label className='sm:basis-40'>Address</label>
                    <div className='grow'>
                        <input
                            type='text'
                            name='address'
                            required
                            className='input w-full'
                            defaultValue={address}
                        />
                        {status === 'error' && (
                            <p className='mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700'>
                                {error}
                            </p>
                        )}
                    </div>
                    {!address && (
                        <span className='absolute right-[3px] top-[3px] md:right-[3px] md:top-[2.5px]'>
                            <Button
                                type='small'
                                disabled={isAddressLoading}
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(fetchAddress());
                                }}
                            >
                                {isAddressLoading
                                    ? 'Getting your loaction'
                                    : 'Get Position'}
                            </Button>
                        </span>
                    )}
                </div>

                <div className='mb-12 flex items-center gap-5'>
                    <input
                        type='checkbox'
                        name='priority'
                        id='priority'
                        // value={withPriority}
                        // onChange={(e) => setWithPriority(e.target.checked)}
                        className='h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2'
                    />
                    <label htmlFor='priority' className='font-medium'>
                        Want to yo give your order priority?
                    </label>
                </div>

                <div>
                    <input
                        type='hidden'
                        name='cart'
                        value={JSON.stringify(cart)}
                    />
                    <input
                        type='hidden'
                        name='postion'
                        value={
                            position.longitude && position.latitude
                                ? `${position.latitude}.${position.longitude}`
                                : ''
                        }
                    />
                    {/* <Button disabled={isSubmitting} type='primary'>
                        {isSubmitting ? 'Placing order...' : 'Order now'}
                    </Button> */}
                    <button
                        disabled={isSubmitting}
                        className='inline-block rounded-full bg-yellow-400 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed md:px-6 md:py-4'
                    >
                        {isSubmitting ? 'Placing order...' : 'Order now'}
                    </button>
                </div>
            </Form>
        </div>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === 'on',
    };

    const errors = {};

    if (!isValidPhone(order.phone)) {
        errors.phone =
            'Please enter a valid phone number. We might need it to contact you.';
    }
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    const newOrder = await createOrder(order);

    store.dispatch(clearCart());

    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
