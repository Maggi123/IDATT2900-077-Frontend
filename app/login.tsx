import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth0 } from "react-native-auth0";

import { Colors } from "@/constants/Colors"; // Make sure Colors are defined

export default function Login() {
  const { authorize } = useAuth0();

  const onLoginPress = async () => {
    try {
      await authorize();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TouchableOpacity style={styles.button} onPress={() => onLoginPress()}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Login with BankID</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 40,
    paddingTop: 30,
    color: Colors.text,
    fontWeight: "bold",
  },
  button: {
    width: "90%",
    backgroundColor: Colors.button,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 15,
    gap: 10,
  },
  buttonText: {
    color: Colors.lightpink,
    fontSize: 30,
  },
});
