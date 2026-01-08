import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function GuestAccessModal({ visible, onClose, onContinue }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Guest Access Features</Text>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>How Guest Login Works</Text>

            <Text style={styles.subTitle}>1. Onboarding Screen</Text>
            <Text style={styles.text}>
              The onboarding screen includes a “Continue as Guest” button. When
              the user selects this option, they enter the app without creating
              an account. No personal details such as name or email are
              collected at this stage.
            </Text>

            <Text style={styles.subTitle}>2. Guest Session Behavior</Text>
            <Text style={styles.text}>
              The app creates a temporary guest session that allows exploration
              of limited features. The session ends when the user logs out,
              closes the app, or upgrades membership.
            </Text>

            <Text style={styles.subTitle}>3. What a Guest User Can Access</Text>
            <Text style={styles.textBold}>Can Access:</Text>
            <Text style={styles.text}>• View Events</Text>
            <Text style={styles.text}>• View Wellbeing content</Text>
            <Text style={styles.text}>
              • View the Upgrade Membership option
            </Text>

            <Text style={styles.textBold}>Cannot Access:</Text>
            <Text style={styles.text}>
              • Join groups, group chats, or private conversations
            </Text>
            <Text style={styles.text}>• Redeem or claim offers</Text>
            <Text style={styles.text}>
              • Access or manage business listings
            </Text>

            <Text style={styles.subTitle}>4. Upgrade Membership Flow</Text>
            <Text style={styles.text}>
              When a guest taps “Upgrade Membership”, they are prompted to
              create an account or log in and provide required details (e.g.,
              name, email). Full access is then unlocked based on membership
              level.
            </Text>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => {
                onContinue && onContinue();
                onClose && onClose();
              }}
            >
              <Text style={styles.continueText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e53935",
    textAlign: "center",
    marginBottom: 12,
  },
  body: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
  textBold: {
    fontSize: 14,
    color: "#333",
    fontWeight: "700",
    marginBottom: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
    marginRight: 8,
    alignItems: "center",
  },
  closeText: {
    color: "#333",
    fontWeight: "600",
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#e53935",
    marginLeft: 8,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
  },
});
