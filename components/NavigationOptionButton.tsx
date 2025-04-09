import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";
import React from "react";

interface NavigationOptionButtonProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
  onPress: () => void;
}

const NavigationOptionButton: React.FC<NavigationOptionButtonProps> = ({
  icon,
  text,
  onPress,
}) => {
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
