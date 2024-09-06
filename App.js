import React, { useEffect } from 'react';
import { View, Button, Platform, Alert } from 'react-native';
import RNSimpleOpenvpn, {
  addVpnStateListener,
  removeVpnStateListener,
} from 'react-native-simple-openvpn';
import { ovpnFile } from './utilis/constants';

const isIPhone = Platform.OS === 'ios';

const App = () => {
  useEffect(() => {
    const observeVpn = async () => {
      try {
        if (isIPhone) {
          await RNSimpleOpenvpn.observeState();
        }

        addVpnStateListener(e => {
          console.log('VPN State:', e); // You can handle VPN state changes here
        });
      } catch (error) {
        console.error('Error observing VPN state:', error.message);
      }
    };

    observeVpn();

    return async () => {
      try {
        if (isIPhone) {
          await RNSimpleOpenvpn.stopObserveState();
        }
        removeVpnStateListener();
      } catch (error) {
        console.error('Error stopping VPN state observation:', error.message);
      }
    };
  }, []);

  const startOvpn = async () => {
    await RNSimpleOpenvpn.connect({
      ovpnString: ovpnFile,
      username: 'client',
      password: 'client',
      providerBundleIdentifier: 'com.vpn.appvpn.NEOvpn',
      localizedDescription: 'RNSimpleOvpn',
    }).then((res) => {
      // console.log('res=====', res);

    }).catch((error) => {
      console.log('error====', error);
    })
    // Alert.alert('VPN Connected');
  };

  const stopOvpn = async () => {
    try {
      await RNSimpleOpenvpn.disconnect();
      // Alert.alert('VPN Disconnected');
    } catch (error) {
      console.log('error=====', error);

      // Alert.alert('Error Disconnecting from VPN', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <Button title="Connect VPN" onPress={startOvpn} />
      <Button title="Disconnect VPN" onPress={stopOvpn} />
    </View>
  );
};

export default App;
