import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import { AuthProvider } from './screens/login/authContext';
import Toast from 'react-native-toast-message';
import AppNavigation from './navigation';
const App = () => {

  return (
    <AuthProvider>
      <Provider store={store}>
        <AppNavigation />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </Provider>
    </AuthProvider>
  );
};

export default App;