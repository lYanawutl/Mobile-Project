import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import {
  addMenuItem,
  getAllOptions,
  getCategories,
  getMenuItemById,
  getMenuItemOptions,
  updateMenuItem,
} from "../db/menuQueries";
import MenuImagePicker from "../components/MenuImagePicker";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/menuFormStyles";
import { colors } from "../styles/theme";
import { showError } from "../utils/alerts";
import { formatBaht } from "../utils/format";

// ข5: เพิ่มเมนูใหม่ (ไม่มี menuItemId) หรือแก้ราคา/รูป/ตัวเลือกของเมนูเดิม
// ชื่อเมนูแก้ไม่ได้หลังสร้าง เพื่อไม่ให้ชื่อในบิลเก่าเปลี่ยนตาม
export default function MenuFormScreen({ navigation, route }) {
  const menuItemId = route.params?.menuItemId ?? null;
  const isEdit = menuItemId !== null;
  const db = useSQLiteContext();

  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [priceText, setPriceText] = useState("");
  const [image, setImage] = useState(null);
  const [optionIds, setOptionIds] = useState([]);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEdit ? "แก้ไขเมนู" : "เพิ่มเมนู" });
  }, [navigation, isEdit]);

  // โหลดครั้งเดียวตอนเปิดฟอร์ม (หน้าอื่นใช้ useReloadOnFocus แต่ฟอร์มไม่ควรโหลดทับค่าที่กำลังพิมพ์)
  useEffect(() => {
    async function loadForm() {
      try {
        setCategories(await getCategories(db));
        setOptions(await getAllOptions(db));
        if (isEdit) {
          const item = await getMenuItemById(db, menuItemId);
          setName(item.name);
          setCategoryId(item.category_id);
          setPriceText(String(item.price));
          setImage(item.image);
          setOptionIds((await getMenuItemOptions(db, menuItemId)).map((option) => option.id));
        }
      } catch (loadError) {
        showError(loadError);
      }
    }
    loadForm();
  }, [db, isEdit, menuItemId]);

  function toggleOption(optionId) {
    setOptionIds((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId],
    );
  }

  async function handleSave() {
    const priceOk = /^\d+$/.test(priceText.trim()) && Number(priceText) > 0;
    if (!isEdit && name.trim() === "") {
      setError("กรอกชื่อเมนู");
      return;
    }
    if (categoryId === null) {
      setError("เลือกหมวดหมู่");
      return;
    }
    if (!priceOk) {
      setError("ราคาต้องเป็นจำนวนเต็มบาทที่มากกว่า 0");
      return;
    }
    setError("");

    try {
      const price = Number(priceText);
      if (isEdit) {
        await updateMenuItem(db, menuItemId, { price, image, optionIds });
      } else {
        await addMenuItem(db, { categoryId, name, price, image, optionIds });
      }
      navigation.goBack();
    } catch (saveError) {
      if (String(saveError.message).includes("UNIQUE")) {
        setError("มีเมนูชื่อนี้อยู่แล้ว");
      } else {
        Alert.alert("บันทึกไม่สำเร็จ", saveError.message);
      }
    }
  }

  return (
    <ScrollView
      style={common.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.field}>
        <Text style={common.label}>ชื่อเมนู</Text>
        {isEdit ? (
          <View style={styles.fixedName}>
            <Text style={styles.fixedNameText}>{name}</Text>
          </View>
        ) : (
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="เช่น แกงส้มชะอมกุ้ง"
            placeholderTextColor={colors.slate}
            style={common.input}
          />
        )}
      </View>

      <View style={styles.field}>
        <Text style={common.label}>หมวดหมู่</Text>
        <View style={styles.chipRow}>
          {categories.map((category) => {
            const active = categoryId === category.id;
            return (
              <Pressable
                key={category.id}
                accessibilityLabel={category.name}
                disabled={isEdit}
                onPress={() => setCategoryId(category.id)}
                style={[common.chip, active && common.chipActive]}
              >
                <Text style={[common.chipText, active && common.chipTextActive]}>
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={common.label}>ราคา (บาท)</Text>
        <TextInput
          value={priceText}
          onChangeText={setPriceText}
          keyboardType="number-pad"
          placeholder="เช่น 60"
          placeholderTextColor={colors.slate}
          style={common.input}
        />
        <Text style={styles.help}>
          แก้ราคาแล้วมีผลกับการสั่งครั้งต่อไป บิลที่สั่งไปแล้วคงราคาเดิม
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={common.label}>รูปเมนู</Text>
        <MenuImagePicker value={image} onChange={setImage} />
      </View>

      <View style={styles.field}>
        <Text style={common.label}>ตัวเลือกเพิ่มที่เมนูนี้ใช้ได้</Text>
        <View style={styles.chipRow}>
          {options.map((option) => {
            const active = optionIds.includes(option.id);
            return (
              <Pressable
                key={option.id}
                accessibilityLabel={option.name}
                onPress={() => toggleOption(option.id)}
                style={[common.chip, active && common.chipActive]}
              >
                <Text style={[common.chipText, active && common.chipTextActive]}>
                  {option.name} +{formatBaht(option.price_delta)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Pressable accessibilityLabel="บันทึก" onPress={handleSave} style={common.button}>
        <Text style={common.buttonText}>บันทึก</Text>
      </Pressable>
    </ScrollView>
  );
}
