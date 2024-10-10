import { useDispatch, useSelector } from 'react-redux';
import Button from '../../ui/Button';
import {
    increaseItemQuantity,
    decreaseItemQuantity,
    getCurrentQuantityById,
} from './cartSlice';

function UpdateItemQuantity({ pizzaid }) {
    const dispatch = useDispatch();
    const currentQuantity = useSelector(getCurrentQuantityById(pizzaid));
    return (
        <div className='flex items-center gap-1 md:gap-3'>
            <Button
                type='round'
                onClick={() => {
                    dispatch(decreaseItemQuantity(pizzaid));
                }}
            >
                -
            </Button>
            <span className='text-sm font-semibold'>{currentQuantity}</span>
            <Button
                type='round'
                onClick={() => {
                    dispatch(increaseItemQuantity(pizzaid));
                }}
            >
                +
            </Button>
        </div>
    );
}
export default UpdateItemQuantity;
