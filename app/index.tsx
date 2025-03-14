import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button1}
        onPress={() => {
          router.push("/login");
        }}
      >
        <Text style={styles.buttonText1}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button2}
        onPress={() => {
          router.push("/register");
        }}
      >
        <Text style={styles.buttonText2}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    gap: 10,
  },
  button1: {
    width: "50%",
    paddingVertical: 15,
    backgroundColor: Colors.button,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  button2: {
    width: "50%",
    paddingVertical: 15,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.button,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText1: {
    color: Colors.lightpink,
    fontSize: 25,
    fontWeight: "bold",
  },
  buttonText2: {
    color: Colors.button,
    fontSize: 25,
    fontWeight: "bold",
  },
});
