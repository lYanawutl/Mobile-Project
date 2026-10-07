import { Text, View } from "react-native";
import { styles } from "../styles/tableIllustrationStyles";

export default function TableIllustration({ number, busy }) {
  const chairStyle = [styles.chair, busy && styles.chairBusy];

  return (
    <View style={styles.wrap}>
      <View style={styles.chairs}>
        <View style={chairStyle} />
        <View style={chairStyle} />
      </View>
      <View style={[styles.table, busy && styles.tableBusy]}>
        <Text style={[styles.number, busy && styles.numberBusy]}>{number}</Text>
      </View>
      <View style={styles.chairs}>
        <View style={chairStyle} />
        <View style={chairStyle} />
      </View>
    </View>
  );
}
