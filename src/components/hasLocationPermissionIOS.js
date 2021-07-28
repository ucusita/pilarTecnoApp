hasLocationPermissionIOS = async () => {
    const openSetting = () => {
        Linking.openSettings().catch(() => {
            Alert.alert('Unable to open settings');
        });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');
    if (status === 'granted') {
        return true;
    }
    if (status === 'denied') {
        Alert.alert('Location permission denied');
    }
    if (status === 'disabled') {
        Alert.alert(
            `Turn on Location Services to allow "${appConfig.displayName}" to determine your
    location.`,
            '',
            [
                { text: 'Go to Settings', onPress: openSetting },
                { text: "Don't Use Location", onPress: () => { } },
            ],
        );
    }
    return false;
};
