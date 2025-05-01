import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

interface Props {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  text: string;
  onPress: () => void;
}

export default function HomeScreenButton({ icon, text, onPress }: Props) {
  return (
    <TouchableOpacity style={defaultStyles.button} onPress={onPress}>
      <View style={defaultStyles.buttonContent}>
        <MaterialCommunityIcons
          name={icon}
          size={40}
          color={Colors.lightpink}
        />
        <Text style={defaultStyles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}
