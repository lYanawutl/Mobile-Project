import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/quantityStepperStyles";

// ปุ่ม − และ + สำหรับจำนวน ค่าอยู่ระหว่าง min ถึง max (ไม่ใส่ max = ไม่จำกัด)
export default function QuantityStepper({ value, onChange, min = 1, max }) {
  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel="ลดจำนวน"
        disabled={!canDecrease}
        onPress={() => onChange(value - 1)}
        style={[styles.button, !canDecrease && styles.buttonDisabled]}
      >
        <Text style={[styles.buttonText, !canDecrease && styles.buttonTextDisabled]}>
          −
        </Text>
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        accessibilityLabel="เพิ่มจำนวน"
        disabled={!canIncrease}
        onPress={() => onChange(value + 1)}
        style={[styles.button, !canIncrease && styles.buttonDisabled]}
      >
        <Text style={[styles.buttonText, !canIncrease && styles.buttonTextDisabled]}>+</Text>
      </Pressable>
    </View>
  );
}
