import { Text, View, StyleSheet } from "react-native";

import { PrescriptionClaims } from "@/agent/Vc";
import { addPrescriptionStyles } from "@/stylesheets/AddPrescriptionStyles";

/**
 * Props for the PrescriptionDeclineAcceptComponent.
 */
type PrescriptionDeclineAcceptComponentProps = {
  newPrescriptionDescription: PrescriptionClaims;
  expirationDate?: Date;
};

/**
 * Component to display prescription details and allow users to accept or decline the prescription.
 *
 * @param {PrescriptionDeclineAcceptComponentProps} props - The component props.
 * @returns The PrescriptionDeclineAcceptComponent.
 */
export default function PrescriptionDeclineAcceptComponent(
  props: PrescriptionDeclineAcceptComponentProps,
) {
  return (
    <View style={styles.overlay}>
      <Text style={addPrescriptionStyles.headerText}>New prescription</Text>
      <Text style={addPrescriptionStyles.overlayText}>
        Check if prescription information is correct, and decline or accept the
        prescription
      </Text>
      <Text style={styles.overlaySectionHeaderText}>Name: </Text>
      <Text style={styles.overlaySectionText}>
        {props.newPrescriptionDescription?.name ?? "N/A"}
      </Text>
      <Text style={styles.overlaySectionHeaderText}>Active ingredient:</Text>
      <Text style={styles.overlaySectionText}>
        {props.newPrescriptionDescription
          ? ((props.newPrescriptionDescription.activeIngredient as string) ??
            "N/A")
          : "N/A"}
      </Text>
      <Text style={styles.overlaySectionHeaderText}>Authored: </Text>
      <Text style={styles.overlaySectionText}>
        {props.newPrescriptionDescription
          ? new Date(
              props.newPrescriptionDescription.authoredOn,
            ).toLocaleDateString()
          : "N/A"}
      </Text>
      <Text style={styles.overlaySectionHeaderText}>Expires at: </Text>
      <Text style={styles.overlaySectionText}>
        {props.expirationDate?.toLocaleDateString() ?? "N/A"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlaySectionHeaderText: {
    ...addPrescriptionStyles.overlayText,
    fontSize: 18,
  },
  overlaySectionText: {
    ...addPrescriptionStyles.overlayText,
    marginTop: 0,
  },
  overlay: {
    ...addPrescriptionStyles.overlay,
    flex: 6,
    overflow: "scroll",
  },
});
