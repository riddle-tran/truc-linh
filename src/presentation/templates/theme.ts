import { extendTheme } from "@chakra-ui/react";
import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"; // import utility to set light and dark mode props

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define a custom variant
const baseStyle = definePartsStyle((props) => {
  const { colorScheme: c } = props; // extract colorScheme from component props

  return {
    tab: {
      // use colorScheme to change background color with dark and light mode options
      // borderTopRadius: "lg",
      color: mode(`#fff`, `#fff`)(props),
      borderBottom: "none",
      fontWeight: "semibold",
      fontSize: "3xl",
      _selected: {
        // bg: mode("#fff", "gray.800")(props),
        color: mode(`#2C7A7B`, `#2C7A7B`)(props),
        borderColor: "inherit",
        borderBottom: "2px solid #2C7A7B",
      },
    },
    tablist: {
      borderBottom: "2x solid",
      borderColor: "inherit",
      fontSize: "3xl",
      paddingTop: "10px",
      color: mode(`#fff`, `#fff`)(props),
    },
    tabpanel: {
      paddingBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
  };
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ baseStyle });

export const theme = extendTheme({
  components: {
    Tabs: tabsTheme,
  },
  styles: {
    global: {
      body: {
        bg: "#FFB6C1",
        // color: 'white',
      },
    },
  },
});
