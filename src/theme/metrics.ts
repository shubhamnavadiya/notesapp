import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const metrics = {
  screenWidth: width,
  screenHeight: height,
  isSmallDevice: width < 375,

  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },

  padding: 16,
  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    round: 999,
  },

  icons: {
    small: 16,
    medium: 24,
    large: 32,
    xl: 48,
  },

  headerHeight: Platform.OS === "ios" ? 44 : 56,
};
