import { Fragment } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/categoryFiltersStyles";

export default function CategoryFilters({
  vertical,
  categories,
  categoryId,
  onlyAvailable,
  onSelectCategory,
  onToggleAvailable,
}) {
  const chips = [
    {
      key: "available",
      label: "เฉพาะที่มีของ",
      active: onlyAvailable,
      onPress: onToggleAvailable,
    },
    {
      key: "all",
      label: "ทุกหมวด",
      active: categoryId === 0,
      onPress: () => onSelectCategory(0),
    },
    ...categories.map((category) => ({
      key: String(category.id),
      label: category.name,
      active: categoryId === category.id,
      onPress: () => onSelectCategory(category.id),
    })),
  ];

  return (
    <ScrollView
      horizontal={!vertical}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={vertical ? styles.column : styles.row}
    >
      {chips.map((chip) => (
        <Fragment key={chip.key}>
          <Pressable
            accessibilityLabel={chip.label}
            onPress={chip.onPress}
            style={[
              common.chip,
              vertical && styles.chipVertical,
              chip.active && common.chipActive,
            ]}
          >
            <Text
              style={[common.chipText, chip.active && common.chipTextActive]}
            >
              {chip.label}
            </Text>
          </Pressable>
          {vertical && chip.key === "available" && (
            <View style={styles.divider} />
          )}
        </Fragment>
      ))}
    </ScrollView>
  );
}
