// defaultStyles.ts
import { Colors } from "@/constants/Colors";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const headerStyles: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.bar,
  },
  headerTintColor: Colors.lightpink,
  headerTitleAlign: "center",
};
