import { useDispatch, useSelector } from 'react-redux';
import Button from '../../ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { addItem, isItemInCart } from '../cart/cartSlice';
import DeleteItem from '../cart/DeleteItem';
import UpdateItemQuantity from '../cart/UpdateItemQuantity';

function MenuItem({ pizza }) {
    const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
    const isInCart = useSelector(isItemInCart(id));

    const dispatch = useDispatch();

    function handleAddItem() {
        const item = {
            pizzaId: id,
            name,
            unitPrice,
            quantity: 1,
            totalPrice: unitPrice * 1,
        };

        dispatch(addItem(item));
    }

    return (
        <li className='flex gap-4 py-2'>
            <img
                src={imageUrl}
                alt={name}
                className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
            />
            <div className='flex grow flex-col pt-0.5'>
                <p className='font-medium'>{name}</p>
                <p className='text-sm capitalize italic text-stone-500'>
                    {ingredients.join(', ')}
                </p>
                <div className='mt-auto flex items-center justify-between'>
                    {!soldOut ? (
                        <p className='text-sm'>{formatCurrency(unitPrice)}</p>
                    ) : (
                        <p className='text-sm font-medium uppercase text-stone-500'>
                            Sold out
                        </p>
                    )}
                    {!soldOut &&
                        (!isInCart ? (
                            <Button type='small' onClick={handleAddItem}>
                                Add to cart
                            </Button>
                        ) : (
                            <div className='flex items-center gap-2 sm:gap-8'>
                                <UpdateItemQuantity pizzaid={id} />
                                <DeleteItem pizzaId={id}>
                                    Remove from cart
                                </DeleteItem>
                            </div>
                        ))}
                </div>
            </div>
        </li>
    );
}

export default MenuItem;
