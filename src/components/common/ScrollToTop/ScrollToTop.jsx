import { useScrollToTop } from '../../../hooks/useScrollToTop';

const ScrollToTop = ({ behavior = 'instant', delay = 0, excludePaths = [] }) => {
  useScrollToTop({ behavior, delay, excludePaths });
  return null;
};

export default ScrollToTop; 