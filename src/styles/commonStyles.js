import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const common = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },

  button: {
    minHeight: 48,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.chili,
  },
  buttonText: { color: colors.surface, fontSize: font.body, fontWeight: "700" },
  buttonSuccess: { backgroundColor: colors.jade },
  buttonOutline: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
  },
  buttonOutlineText: { color: colors.ink },
  buttonDisabled: { backgroundColor: colors.line },
  buttonDisabledText: { color: colors.slate },

  chip: {
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.inkSoft, fontSize: font.small, fontWeight: "600" },
  chipTextActive: { color: colors.surface },

  input: {
    minHeight: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: space.md,
    fontSize: font.body,
    color: colors.ink,
  },
  label: {
    color: colors.inkSoft,
    fontSize: font.small,
    fontWeight: "600",
    marginBottom: space.xs,
  },

  headerButton: { paddingHorizontal: space.md, paddingVertical: space.sm },
  headerButtonText: {
    color: colors.chili,
    fontSize: font.body,
    fontWeight: "700",
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: space.xl * 2,
    paddingHorizontal: space.xl,
    gap: space.sm,
  },
  emptyTitle: { color: colors.ink, fontSize: font.title, fontWeight: "700" },
  emptyText: {
    color: colors.inkSoft,
    fontSize: font.body,
    textAlign: "center",
  },
});
