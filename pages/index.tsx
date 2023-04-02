import { Provider } from 'react-redux';
import { store } from '@/store';
import Display from '@/components/Display';


export const HomePage = () => {
  return (
    <Provider store={store}>
      <Display />
    </Provider>
  );
};

export default HomePage;