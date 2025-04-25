import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { Colors } from "@/constants/Colors";

/**
 * Styles for the header in the navigation stack.
 */
export const headerStyles: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.bar,
  },
  headerTintColor: Colors.lightpink,
  headerTitleAlign: "center",
};
