import { formatCurrency } from '../../utils/helpers';

function OrderItem({ item, isLoadingIngredients, ingredients }) {
    const { quantity, name, totalPrice } = item;

    return (
        <li className='space-y-1 py-3 sm:space-y-2'>
            <div className='flex items-center justify-between gap-4 text-sm'>
                <div>
                    <p>
                        <span className='font-bold'>{quantity}&times;</span>{' '}
                        {name}
                    </p>
                    <p className='capatilize text-sm italic text-stone-500'>
                        {isLoadingIngredients
                            ? 'Loading...'
                            : `ingredients: ${ingredients.join(', ')}`}
                    </p>
                </div>
                <p className='font-bold'>{formatCurrency(totalPrice)}</p>
            </div>
        </li>
    );
}

export default OrderItem;
