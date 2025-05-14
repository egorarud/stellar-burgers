import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { getFeedState, getFeedThunk } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const feed = useSelector(getFeedState);
  const orders: TOrder[] = feed?.orders || [];

  const dispatch = useDispatch();

  const handleGetFeed = () => {
    dispatch(getFeedThunk());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeed} />;
};
