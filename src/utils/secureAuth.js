import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Keychain from "react-native-keychain";
import ReactNativeBiometrics from "react-native-biometrics";

const BIOMETRICS_ENABLED_KEY = "biometricsEnabled";
const SERVICE_NAME = "gbs.secure.session";

export async function isBiometricAvailable() {
  try {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    return { available: !!available, biometryType: biometryType || null };
  } catch (e) {
    return { available: false, biometryType: null };
  }
}

export async function setBiometricsEnabled(enabled) {
  try {
    await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, JSON.stringify(!!enabled));
  } catch {}
}

export async function getBiometricsEnabled() {
  try {
    const raw = await AsyncStorage.getItem(BIOMETRICS_ENABLED_KEY);
    return raw ? JSON.parse(raw) : false;
  } catch {
    return false;
  }
}

// Store tokens securely. If requireBiometrics is true, reading will require biometric auth
export async function setSession(session, { requireBiometrics = false } = {}) {
  const payload = JSON.stringify(session || {});
  try {
    const options = {};

    // iOS/Android: set access control when biometrics required
    if (requireBiometrics) {
      options.accessControl = Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET;
      options.accessible = Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY;
      // On Android, also request the highest security level when possible
      options.securityLevel = Keychain.SECURITY_LEVEL.SECURE_HARDWARE;
    }

    await Keychain.setGenericPassword("auth", payload, {
      service: SERVICE_NAME,
      ...options,
    });

    if (requireBiometrics) {
      await setBiometricsEnabled(true);
    }

    return true;
  } catch (e) {
    return false;
  }
}

// Retrieve tokens. If they were stored with biometric access control, this will prompt the user when prompt=true
export async function getSession({ prompt = false } = {}) {
  try {
    const result = await Keychain.getGenericPassword({
      service: SERVICE_NAME,
      authenticationPrompt: prompt
        ? { title: "Unlock with biometrics" }
        : undefined,
    });

    if (result && result.password) {
      return JSON.parse(result.password);
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function clearSession() {
  try {
    await Keychain.resetGenericPassword({ service: SERVICE_NAME });
  } catch {}
  try {
    await setBiometricsEnabled(false);
  } catch {}
}
