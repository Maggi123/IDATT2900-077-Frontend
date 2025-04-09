// defaultStyles.ts
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { Colors } from "@/constants/Colors";

export const headerStyles: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.bar,
  },
  headerTintColor: Colors.lightpink,
  headerTitleAlign: "center",
};
