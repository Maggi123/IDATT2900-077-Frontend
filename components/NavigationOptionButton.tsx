import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Props for the NavigationOptionButton component.
 */
interface NavigationOptionButtonProps {
  /** Icon name from MaterialCommunityIcons. */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Text to display on the button. */
  text: string;
  /** Function to call when the button is pressed. */
  onPress: () => void;
}

/**
 * A button component displaying an icon and text, which triggers a function when pressed.
 *
 * @param {NavigationOptionButtonProps} props - The props for the component.
 * @returns The rendered component.
 */
const NavigationOptionButton = ({
  icon,
  text,
  onPress,
}: NavigationOptionButtonProps) => {
  return (
    <TouchableOpacity style={defaultStyles.optionButton} onPress={onPress}>
      <View style={defaultStyles.optionButtonContent}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={Colors.lightpurple}
        />
        <Text style={defaultStyles.optionButtonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NavigationOptionButton;
