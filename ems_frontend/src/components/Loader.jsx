// 📁 src/components/Loader.jsx
import { THEME_COLORS } from "../constants/colors";

const Loader = () => {
  return (
    <div className="flex justify-center py-6">
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div
          className="absolute inset-0 border-4 border-t-transparent border-r-transparent rounded-full animate-spin"
          style={{
            borderColor: `${THEME_COLORS.primary} ${THEME_COLORS.primary} transparent transparent`,
            animationDuration: "1s",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;