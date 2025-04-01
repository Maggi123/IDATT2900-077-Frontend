import { Text, View } from "react-native";

import { PrescriptionClaims } from "@/agent/Vc";
import { addPrescriptionStyles } from "@/stylesheets/AddPrescriptionStyles";

type PrescriptionDeclineAcceptComponentProps = {
  newPrescriptionDescription: PrescriptionClaims;
};

export default function PrescriptionDeclineAcceptComponent(
  props: PrescriptionDeclineAcceptComponentProps,
) {
  return (
    <View style={addPrescriptionStyles.overlay}>
      <Text style={addPrescriptionStyles.headerText}>New prescription</Text>
      <Text style={addPrescriptionStyles.overlayText}>
        Check if prescription information is correct, and decline or accept the
        prescription
      </Text>
      <Text style={addPrescriptionStyles.overlayText}>Name: </Text>
      <Text style={addPrescriptionStyles.overlayText}>
        {props.newPrescriptionDescription
          ? props.newPrescriptionDescription.name
          : "N/A"}
      </Text>
      <Text style={addPrescriptionStyles.overlayText}>Active ingredient:</Text>
      <Text style={addPrescriptionStyles.overlayText}>
        {props.newPrescriptionDescription
          ? ((props.newPrescriptionDescription.activeIngredient as string) ??
            "N/A")
          : "N/A"}
      </Text>
      <Text style={addPrescriptionStyles.overlayText}>Authored: </Text>
      <Text style={addPrescriptionStyles.overlayText}>
        {props.newPrescriptionDescription
          ? new Date(
              props.newPrescriptionDescription.authoredOn,
            ).toLocaleDateString()
          : "N/A"}
      </Text>
    </View>
  );
}
